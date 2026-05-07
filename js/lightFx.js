export function createLightFx(app, camera) {
    // Создаём отдельный контейнер для бликов, который движется вместе с картой
    const fxLayer = new PIXI.Container();
    camera.addChild(fxLayer);
    
    const textures = [
        PIXI.Texture.from('../assets/images/light1.png'),
        PIXI.Texture.from('../assets/images/light2.png'),
        PIXI.Texture.from('../assets/images/light3.png'),
        PIXI.Texture.from('../assets/images/light4.png')
    ];

    // 🔥 ИЩЕМ КАРТУ ПРАВИЛЬНО (не по индексу, а по типу)
    let mapSprite = null;
    for (let i = 0; i < camera.children.length; i++) {
        const child = camera.children[i];
        if (child instanceof PIXI.Sprite && child.texture && child.texture.width > 0) {
            mapSprite = child;
            break;
        }
    }
    
    if (!mapSprite || !mapSprite.texture) {
        console.warn('Map sprite not found, retrying in 100ms');
        setTimeout(() => createLightFx(app, camera), 100);
        return;
    }
    
    console.log('Map sprite found for lights');

    // ----------------------------
    // СОЗДАЁМ КАСТОМНЫЙ ШЕЙДЕР ДЛЯ ОСВЕТЛЕНИЯ
    // ----------------------------
    const lightFilter = new PIXI.Filter(null, `
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        
        vec3 rgb2hsv(vec3 c) {
            vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
            vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
            
            float d = q.x - min(q.w, q.y);
            float e = 1.0e-10;
            return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }
        
        vec3 hsv2rgb(vec3 c) {
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        void main(void) {
            vec4 color = texture2D(uSampler, vTextureCoord);
            
            vec3 hsv = rgb2hsv(color.rgb);
            hsv.z = min(hsv.z * 3.4, 1.0);
            hsv.y = min(hsv.y * 1.9, 1.0);
            color.rgb = hsv2rgb(hsv);
            
            float brightness = (color.r + color.g + color.b) / 3.0;
            vec3 glow = vec3(brightness * brightness * 1.4);
            color.rgb += glow;
            color.rgb = clamp(color.rgb, 0.0, 1.0);
            
            gl_FragColor = color;
        }
    `);

    // ----------------------------
    // РЕАЛЬНЫЕ БЛИКИ
    // ----------------------------
    const lights = [];
    let lastLightTime = performance.now();
    const lightInterval = 4000;
    let currentTextureIndex = 0;
    
    const mapBounds = () => ({
        w: mapSprite.texture.width,
        h: mapSprite.texture.height
    });
    
    const BASE_SPEED = 0.3;
    
    function createLight(texture) {
        const light = new PIXI.Sprite(texture);
        light.anchor.set(0.5);
        light.filters = [lightFilter];
        light.blendMode = PIXI.BLEND_MODES.ADD;
        light.alpha = 0.2;
        light.tint = 0xffffff;
        light.visible = false;
        light.active = false;
        light.isFirstLight = false;
        
        fxLayer.addChild(light);
        lights.push(light);
        
        return light;
    }
    
    function activateLight(light, isFirst = false) {
        const { w, h } = mapBounds();
    
        const randomTexture = textures[Math.floor(Math.random() * textures.length)];
    
        if (!randomTexture.baseTexture.valid) {
            randomTexture.baseTexture.once('loaded', () => {
                activateLight(light, isFirst);
            });
            return;
        }
    
        light.texture = randomTexture;
    
        if (isFirst) {
            light.x = w * 0.4 + Math.random() * w * 0.2;
        } else {
            light.x = -randomTexture.width;
        }
    
        light.y = Math.random() * h;
    
        const baseScale = (h / 4) / randomTexture.height * (0.7 + Math.random() * 0.3);
    
        light.baseScale = baseScale;
        light.scale.set(baseScale);
    
        light.speed = BASE_SPEED;
        light.alpha = 0.2;
    
        light.active = true;
        light.visible = true;
        light.isFirstLight = isFirst;
    }
    
    function deactivateLight(light) {
        light.active = false;
        light.visible = false;
    }
    
    for (let i = 0; i < 6; i++) {
        const texture = textures[i % textures.length];
        createLight(texture);
    }
    
    function tryActivateNewLight(isFirst = false) {
        const inactiveLights = lights.filter(l => !l.active);
        if (inactiveLights.length > 0) {
            const randomLight = inactiveLights[Math.floor(Math.random() * inactiveLights.length)];
            activateLight(randomLight, isFirst);
            console.log('New light created');
            return true;
        }
        return false;
    }
    
    setTimeout(() => {
        tryActivateNewLight(true);
    }, 500);
    
    setTimeout(() => {
        tryActivateNewLight(true);
    }, 500);
    
    setTimeout(() => {
        tryActivateNewLight(false);
        lastLightTime = performance.now();
    }, 3000);
    
    app.ticker.add((delta) => {
        const now = performance.now();
        const { w, h } = mapBounds();
        
        for (let light of lights) {
            if (!light.active) continue;
            
            light.x += light.speed * delta;
            
            if (light.baseScale) {
                light.scale.set(light.baseScale);
            }
            
            if (light.x > w + light.width) {
                deactivateLight(light);
                console.log('Light deactivated');
                
                setTimeout(() => {
                    tryActivateNewLight(false);
                }, 1000);
            }
        }
        
        if (now - lastLightTime >= lightInterval) {
            if (tryActivateNewLight(false)) {
                lastLightTime = now;
            }
        }
    });
}