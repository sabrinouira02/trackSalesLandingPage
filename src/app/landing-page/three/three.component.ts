import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import {
  Lensflare,
  LensflareElement,
} from 'three/examples/jsm/objects/Lensflare.js';

@Component({
  selector: 'app-three',
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.scss'],
})
export class ThreeComponent implements OnInit, OnDestroy {
  @ViewChild('container', { static: true }) containerRef!: ElementRef;

  private container!: HTMLElement;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private controls!: FlyControls;
  private stats!: Stats;
  private clock!: THREE.Clock;

  constructor() {}

  ngOnInit(): void {
    this.init();
    this.animate();
  }

  ngOnDestroy(): void {
    // Clean up resources if needed
  }

  private init(): void {
    this.container = this.containerRef.nativeElement;

    // camera
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      15000
    );
    this.camera.position.z = 250;

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01);
    this.scene.fog = new THREE.Fog(this.scene.background, 3500, 15000);

    // world
    const s = 250;
    const geometry = new THREE.BoxGeometry(s, s, s);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
      shininess: 50,
    });

    for (let i = 0; i < 3000; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
      mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
      mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      this.scene.add(mesh);
    }

    // lights
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.15);
    dirLight.position.set(0, -1, 0).normalize();
    dirLight.color.setHSL(0.1, 0.7, 0.5);
    this.scene.add(dirLight);

    // lensflares
    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load(
      'textures/lensflare/lensflare0.png'
    );
    const textureFlare3 = textureLoader.load(
      'textures/lensflare/lensflare3.png'
    );
    this.addLight(0.55, 0.9, 0.5, 5000, 0, -1000, textureFlare0, textureFlare3);
    this.addLight(0.08, 0.8, 0.5, 0, 0, -1000, textureFlare0, textureFlare3);
    this.addLight(
      0.995,
      0.5,
      0.9,
      5000,
      5000,
      -1000,
      textureFlare0,
      textureFlare3
    );

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    // controls
    this.controls = new FlyControls(this.camera, this.renderer.domElement);
    this.controls.movementSpeed = 2500;
    this.controls.domElement = this.container;
    this.controls.rollSpeed = Math.PI / 6;
    this.controls.autoForward = false;
    this.controls.dragToLook = false;

    // stats
    this.stats = new Stats();
    this.container.appendChild(this.stats.dom);

    // events
    window.addEventListener('resize', () => this.onWindowResize());

    this.clock = new THREE.Clock();
  }

  private addLight(
    h: number,
    s: number,
    l: number,
    x: number,
    y: number,
    z: number,
    textureFlare0: THREE.Texture,
    textureFlare3: THREE.Texture
  ): void {
    const light = new THREE.PointLight(0xffffff, 1.5, 2000, 0);
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    this.scene.add(light);

    const lensflare = new Lensflare();
    lensflare.addElement(
      new LensflareElement(textureFlare0, 700, 0, light.color)
    );
    lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
    light.add(lensflare);
  }

  private onWindowResize(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.render();
    this.stats.update();
  }

  private render(): void {
    const delta = this.clock.getDelta();
    this.controls.update(delta);
    this.renderer.render(this.scene, this.camera);
  }
}
