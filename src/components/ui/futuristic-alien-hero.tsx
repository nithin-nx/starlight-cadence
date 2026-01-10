"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// --- Simplex Noise Library ---
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
const F3 = 1.0 / 3.0;
const G3 = 1.0 / 6.0;
const F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
const G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

class SimplexNoise {
    p: Uint8Array;
    perm: Uint8Array;
    permMod12: Uint8Array;

    constructor(random?: () => number) {
        if (typeof random !== 'function') random = Math.random;
        this.p = new Uint8Array(256);
        this.perm = new Uint8Array(512);
        this.permMod12 = new Uint8Array(512);
        for (let i = 0; i < 256; i++) {
            this.p[i] = i;
        }
        for (let i = 255; i > 0; i--) {
            const r = Math.floor(random() * (i + 1));
            const t = this.p[i];
            this.p[i] = this.p[r];
            this.p[r] = t;
        }
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
            this.permMod12[i] = this.perm[i] % 12;
        }
    }

    noise2D(xin: number, yin: number): number {
        const perm = this.perm;
        let n0, n1, n2;
        const s = (xin + yin) * F2;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;
        let i1, j1;
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        } else {
            i1 = 0;
            j1 = 1;
        }
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2;
        const y2 = y0 - 1.0 + 2.0 * G2;
        const ii = i & 255;
        const jj = j & 255;
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.grad2(perm[ii + perm[jj]], x0, y0);
        }
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.grad2(perm[ii + i1 + perm[jj + j1]], x1, y1);
        }
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.grad2(perm[ii + 1 + perm[jj + 1]], x2, y2);
        }
        return 70.0 * (n0 + n1 + n2);
    }

    noise3D(xin: number, yin: number, zin: number): number {
        const perm = this.perm;
        let n0, n1, n2, n3;
        const s = (xin + yin + zin) * F3;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const k = Math.floor(zin + s);
        const t = (i + j + k) * G3;
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;
        const z0 = zin - Z0;
        let i1, j1, k1;
        let i2, j2, k2;
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
            } else if (x0 >= z0) {
                i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
            } else {
                i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
            }
        } else {
            if (y0 < z0) {
                i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
            } else if (x0 < z0) {
                i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
            } else {
                i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
            }
        }
        const x1 = x0 - i1 + G3;
        const y1 = y0 - j1 + G3;
        const z1 = z0 - k1 + G3;
        const x2 = x0 - i2 + 2.0 * G3;
        const y2 = y0 - j2 + 2.0 * G3;
        const z2 = z0 - k2 + 2.0 * G3;
        const x3 = x0 - 1.0 + 3.0 * G3;
        const y3 = y0 - 1.0 + 3.0 * G3;
        const z3 = z0 - 1.0 + 3.0 * G3;
        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;
        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.grad3(perm[ii + perm[jj + perm[kk]]], x0, y0, z0);
        }
        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.grad3(perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]], x1, y1, z1);
        }
        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.grad3(perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]], x2, y2, z2);
        }
        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0.0;
        else {
            t3 *= t3;
            n3 = t3 * t3 * this.grad3(perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]], x3, y3, z3);
        }
        return 32.0 * (n0 + n1 + n2 + n3);
    }

    noise4D(x: number, y: number, z: number, w: number): number {
        const perm = this.perm;
        let n0, n1, n2, n3, n4;
        const s = (x + y + z + w) * F4;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const k = Math.floor(z + s);
        const l = Math.floor(w + s);
        const t = (i + j + k + l) * G4;
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t;
        const W0 = l - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        const z0 = z - Z0;
        const w0 = w - W0;
        const c = (x0 > y0 ? 32 : 0) + (x0 > z0 ? 16 : 0) + (x0 > w0 ? 8 : 0) + (y0 > z0 ? 4 : 0) + (y0 > w0 ? 2 : 0) + (z0 > w0 ? 1 : 0);
        const i1 = (c & 1) !== 0 ? 1 : 0;
        const j1 = (c & 2) !== 0 ? 1 : 0;
        const k1 = (c & 4) !== 0 ? 1 : 0;
        const l1 = (c & 8) !== 0 ? 1 : 0;
        const i2 = (c & 16) !== 0 ? 1 : 0;
        const j2 = (c & 32) !== 0 ? 1 : 0;
        const k2 = (c & 64) !== 0 ? 1 : 0;
        const l2 = (c & 128) !== 0 ? 1 : 0;
        const x1 = x0 - i1 + G4;
        const y1 = y0 - j1 + G4;
        const z1 = z0 - k1 + G4;
        const w1 = w0 - l1 + G4;
        const x2 = x0 - i2 + 2.0 * G4;
        const y2 = y0 - j2 + 2.0 * G4;
        const z2 = z0 - k2 + 2.0 * G4;
        const w2 = w0 - l2 + 2.0 * G4;
        const x3 = x0 - 1.0 + 3.0 * G4;
        const y3 = y0 - 1.0 + 3.0 * G4;
        const z3 = z0 - 1.0 + 3.0 * G4;
        const w3 = w0 - 1.0 + 3.0 * G4;
        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;
        const ll = l & 255;
        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
        if (t0 < 0) n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.grad4(perm[ii + perm[jj + perm[kk + perm[ll]]]], x0, y0, z0, w0);
        }
        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
        if (t1 < 0) n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.grad4(perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]], x1, y1, z1, w1);
        }
        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
        if (t2 < 0) n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.grad4(perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]], x2, y2, z2, w2);
        }
        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
        if (t3 < 0) n3 = 0.0;
        else {
            t3 *= t3;
            n3 = t3 * t3 * this.grad4(perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]], x3, y3, z3, w3);
        }
        return 27.0 * (n0 + n1 + n2 + n3 + (n4 ?? 0));
    }

    grad2(hash: number, x: number, y: number): number {
        const h = hash & 7;
        const u = h < 4 ? x : y;
        const v = h < 4 ? y : x;
        return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
    }

    grad3(hash: number, x: number, y: number, z: number): number {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
    }

    grad4(hash: number, x: number, y: number, z: number, t: number): number {
        const h = hash & 31;
        const u = h < 24 ? x : y;
        const v = h < 16 ? y : z;
        const w = h < 8 ? z : t;
        return ((h & 1) ? -u : u) + ((h & 2) ? -v : v) + ((h & 4) ? -w : w);
    }
}

interface FuturisticAlienHeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export const FuturisticAlienHero: React.FC<FuturisticAlienHeroProps> = ({
  title = "ISTE",
  subtitle = "GEC Barton Hill",
  ctaText = "Join Chapter",
  ctaHref = "#join"
}) => {
    const mountRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: currentMount,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 5;

        // Lighting
        const pointLight = new THREE.PointLight(0x00f0ff, 1.5, 100);
        pointLight.position.set(0, 0, 7);
        scene.add(pointLight);
        
        const ambientLight = new THREE.AmbientLight(0x404040, 3);
        scene.add(ambientLight);

        // Alien Artifact & Core
        const simplex = new SimplexNoise();
        const artifactGeometry = new THREE.IcosahedronGeometry(1.5, 20);
        artifactGeometry.setAttribute('originalPosition', artifactGeometry.attributes.position.clone());

        const artifactMaterial = new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            metalness: 0.3,
            roughness: 0.1,
            envMapIntensity: 0.9,
            transparent: true,
            opacity: 0.5,
            premultipliedAlpha: true
        });
        const artifact = new THREE.Mesh(artifactGeometry, artifactMaterial);
        scene.add(artifact);

        const coreGeometry = new THREE.IcosahedronGeometry(0.5, 5);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            wireframe: true
        });
        const energyCore = new THREE.Mesh(coreGeometry, coreMaterial);
        artifact.add(energyCore);

        // Nebula Particle System
        const nebulaGeometry = new THREE.BufferGeometry();
        const nebulaCount = 15000;
        const posArray = new Float32Array(nebulaCount * 3);
        const colorArray = new Float32Array(nebulaCount * 3);
        const nebulaColors = [new THREE.Color(0x00f0ff), new THREE.Color(0x8b5cf6), new THREE.Color(0x06b6d4)];

        for(let i = 0; i < nebulaCount; i++) {
            posArray[i*3 + 0] = (Math.random() - 0.5) * 25;
            posArray[i*3 + 1] = (Math.random() - 0.5) * 25;
            posArray[i*3 + 2] = (Math.random() - 0.5) * 25;
            const randomColor = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
            colorArray[i*3 + 0] = randomColor.r;
            colorArray[i*3 + 1] = randomColor.g;
            colorArray[i*3 + 2] = randomColor.b;
        }
        nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const nebulaMaterial = new THREE.PointsMaterial({
            size: 0.015,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.6
        });
        const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
        scene.add(nebula);

        // Mouse Interaction
        let mouseX = 0, mouseY = 0;
        const handleMouseMove = (event: MouseEvent) => {
            mouseX = (event.clientX - window.innerWidth / 2) / 100;
            mouseY = (event.clientY - window.innerHeight / 2) / 100;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Window Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Animation Loop
        const clock = new THREE.Clock();
        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            artifact.rotation.y = 0.1 * elapsedTime;
            artifact.rotation.x = 0.05 * elapsedTime;
            energyCore.rotation.y = -0.5 * elapsedTime;
            energyCore.scale.setScalar(Math.sin(elapsedTime * 2) * 0.2 + 1);

            nebula.rotation.y += 0.0002;
            nebula.rotation.x += 0.0001;

            const positions = artifact.geometry.attributes.position;
            const originalPositions = artifact.geometry.attributes.originalPosition as THREE.BufferAttribute;
            for (let i = 0; i < positions.count; i++) {
                const ox = originalPositions.getX(i);
                const oy = originalPositions.getY(i);
                const oz = originalPositions.getZ(i);
                const noise = simplex.noise4D(ox * 0.5, oy * 0.5, oz * 0.5, elapsedTime * 0.15);
                const displacement = new THREE.Vector3(ox, oy, oz).normalize().multiplyScalar(noise * 0.2);
                positions.setX(i, ox + displacement.x);
                positions.setY(i, oy + displacement.y);
                positions.setZ(i, oz + displacement.z);
            }
            positions.needsUpdate = true;

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
        };
    }, []);

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i,
                duration: 1.2,
                ease: [0.23, 0.86, 0.39, 0.96] as const
            },
        }),
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-background">
            <canvas ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[1]" />
            
            <section className="relative h-screen flex items-center justify-center overflow-hidden z-10">
                <div className="text-center p-4">
                    <motion.div
                        variants={fadeUpVariants}
                        custom={0.3}
                        initial="hidden"
                        animate="visible"
                        className="mb-4"
                    >
                        <span className="inline-block px-4 py-2 text-xs font-medium tracking-[0.3em] uppercase text-primary border border-primary/30 rounded-full bg-primary/5">
                            Indian Society for Technical Education
                        </span>
                    </motion.div>
                    
                    <motion.h1
                        className="font-orbitron text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider"
                    >
                        <motion.span 
                            variants={fadeUpVariants} 
                            custom={0.5} 
                            initial="hidden" 
                            animate="visible" 
                            className="block text-glow text-primary"
                        >
                            {title}
                        </motion.span>
                        <motion.span 
                            variants={fadeUpVariants} 
                            custom={0.8} 
                            initial="hidden" 
                            animate="visible" 
                            className="block mt-2 text-2xl sm:text-3xl md:text-4xl text-foreground/80 font-light tracking-widest"
                        >
                            {subtitle}
                        </motion.span>
                    </motion.h1>
                    
                    <motion.p 
                        variants={fadeUpVariants} 
                        custom={1.1} 
                        initial="hidden" 
                        animate="visible"
                        className="mt-6 max-w-xl mx-auto text-muted-foreground text-lg"
                    >
                        Empowering future technologists through innovation, collaboration, and excellence.
                    </motion.p>
                    
                    <motion.div 
                        variants={fadeUpVariants} 
                        custom={1.4} 
                        initial="hidden" 
                        animate="visible" 
                        className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <a
                            href={ctaHref}
                            className="btn-glow btn-pulse"
                        >
                            {ctaText}
                        </a>
                        <a
                            href="#about"
                            className="px-8 py-3 font-semibold uppercase tracking-widest text-foreground/70 border-2 border-white/10 rounded-lg transition-all duration-300 hover:border-primary/50 hover:text-primary"
                        >
                            Learn More
                        </a>
                    </motion.div>
                </div>
            </section>
            
            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            >
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-5 h-8 border-2 border-muted-foreground/50 rounded-full flex justify-center pt-2"
                    >
                        <div className="w-1 h-2 bg-primary rounded-full" />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default FuturisticAlienHero;
