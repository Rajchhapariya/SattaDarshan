"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import Link from "next/link";
import { 
  Eye, 
  Layers, 
  Compass, 
  Landmark, 
  X, 
  ChevronRight, 
  RotateCcw,
  AlertCircle,
  Users
} from "lucide-react";
import { CivicAvatar } from "@/components/politician/CivicAvatar";
import { cn } from "@/lib/utils";

export type SeatData = {
  seatNumber: number;
  name: string;
  slug: string;
  partyName: string;
  partySlug?: string;
  alliance: string;
  color: string;
  photo?: string;
  constituency: string;
  state: string;
};

type ChamberProps = {
  chamber?: "Lok Sabha" | "Rajya Sabha";
  initialSeats?: SeatData[];
  className?: string;
};

type CameraPreset = "overview" | "dais" | "top";

export function ThreeParliamentChamber({ 
  chamber = "Lok Sabha", 
  initialSeats,
  className 
}: ChamberProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [seats, setSeats] = useState<SeatData[]>(initialSeats || []);
  const [loading, setLoading] = useState(!initialSeats);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSeat, setHoveredSeat] = useState<SeatData | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [activeAlliance, setActiveAlliance] = useState<string>("All");
  const [activePreset, setActivePreset] = useState<CameraPreset | null>("overview");
  const [allianceStats, setAllianceStats] = useState({ NDA: 0, INDIA: 0, Others: 0, total: 0 });

  // References for live 3D interaction without recreating Three.js scene
  const filterUpdateRef = useRef<((filter: string) => void) | null>(null);
  const presetTriggerRef = useRef<((preset: CameraPreset) => void) | null>(null);
  const selectSeatIn3DRef = useRef<((seatSlug: string | null) => void) | null>(null);

  // Fetch seat data if not passed directly
  useEffect(() => {
    if (initialSeats && initialSeats.length > 0) {
      setSeats(initialSeats);
      computeStats(initialSeats);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    fetch(`/api/parliament/seats?chamber=${encodeURIComponent(chamber)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load parliament seating data");
        return res.json();
      })
      .then((data) => {
        const fetchedSeats: SeatData[] = data.seats || [];
        setSeats(fetchedSeats);
        computeStats(fetchedSeats);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load parliament seats:", err);
        setError("Unable to load parliamentary seat records. Please try again.");
        setLoading(false);
      });
  }, [chamber, initialSeats]);

  const computeStats = (list: SeatData[]) => {
    let nda = 0, india = 0, others = 0;
    list.forEach((s) => {
      if (s.alliance === "NDA") nda++;
      else if (s.alliance === "INDIA") india++;
      else others++;
    });
    setAllianceStats({ NDA: nda, INDIA: india, Others: others, total: list.length });
  };

  // Synchronize 3D alliance filter with React state
  const handleAllianceFilter = useCallback((alliance: string) => {
    setActiveAlliance(alliance);
    filterUpdateRef.current?.(alliance);
  }, []);

  // Synchronize camera preset triggers
  const handlePresetClick = useCallback((preset: CameraPreset) => {
    setActivePreset(preset);
    presetTriggerRef.current?.(preset);
  }, []);

  // Handle selected seat state update
  const handleSelectSeat = useCallback((seat: SeatData | null) => {
    setSelectedSeat(seat);
    selectSeatIn3DRef.current?.(seat ? seat.slug : null);
  }, []);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container || seats.length === 0) return;

    let width = container.clientWidth;
    let height = container.clientHeight || 460;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.background = null; // Transparent to inherit theme background

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    const initialPos = width < 640 ? new THREE.Vector3(0, 50, 74) : new THREE.Vector3(0, 44, 66);
    const initialTarget = new THREE.Vector3(0, 3, 14);
    camera.position.copy(initialPos);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // --- 2. OrbitControls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2.06; // Prevent underground camera navigation
    controls.minDistance = 18;
    controls.maxDistance = 135;
    controls.target.copy(initialTarget);
    controls.update();

    // Reset active preset pill when user manually orbits
    controls.addEventListener("start", () => {
      isTransitioningCamera = false;
      setActivePreset(null);
    });

    // --- 3. Camera Smooth Transition Engine ---
    let isTransitioningCamera = false;
    let transitionStartTime = 0;
    const transitionDuration = 720; // ms
    const camStartPos = new THREE.Vector3();
    const camEndPos = new THREE.Vector3();
    const targetStartPos = new THREE.Vector3();
    const targetEndPos = new THREE.Vector3();

    function easeInOutCubic(t: number): number {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    const startCameraTransition = (destPos: THREE.Vector3, destTarget: THREE.Vector3) => {
      camStartPos.copy(camera.position);
      camEndPos.copy(destPos);
      targetStartPos.copy(controls.target);
      targetEndPos.copy(destTarget);
      transitionStartTime = performance.now();
      isTransitioningCamera = true;
    };

    presetTriggerRef.current = (preset: CameraPreset) => {
      const isNarrow = container.clientWidth < 640;
      if (preset === "overview") {
        const destPos = isNarrow ? new THREE.Vector3(0, 52, 76) : new THREE.Vector3(0, 44, 66);
        startCameraTransition(destPos, new THREE.Vector3(0, 3, 14));
      } else if (preset === "dais") {
        startCameraTransition(new THREE.Vector3(0, 6.5, -4.5), new THREE.Vector3(0, 4, 26));
      } else if (preset === "top") {
        // High top-down view with tiny 0.01 Z offset to prevent Euler gimbal lock
        startCameraTransition(new THREE.Vector3(0, 80, 14.01), new THREE.Vector3(0, 0, 14));
      }
    };

    // --- 4. Lighting System (Civic Architectural Lighting) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
    keyLight.position.set(25, 45, 25);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf1f5f9, 0.7);
    fillLight.position.set(-25, 30, -15);
    scene.add(fillLight);

    const centerPointLight = new THREE.PointLight(0xffeedd, 0.8, 120);
    centerPointLight.position.set(0, 22, 12);
    scene.add(centerPointLight);

    // --- 5. Shared Materials (Performance Optimized) ---
    const ndaMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Warm Amber
      roughness: 0.38,
      metalness: 0.14,
      emissive: 0xd97706,
      emissiveIntensity: 0.08,
    });

    const indiaMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Royal Blue
      roughness: 0.38,
      metalness: 0.14,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.08,
    });

    const othersMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981, // Emerald Teal
      roughness: 0.38,
      metalness: 0.14,
      emissive: 0x059669,
      emissiveIntensity: 0.08,
    });

    const ndaDimMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.6,
      transparent: true,
      opacity: 0.22,
    });

    const indiaDimMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.6,
      transparent: true,
      opacity: 0.22,
    });

    const othersDimMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.6,
      transparent: true,
      opacity: 0.22,
    });

    // --- 6. Architectural Chamber Components ---
    // A. Stepped Speaker's Dais
    const lowerDaisGeo = new THREE.CylinderGeometry(5.4, 5.8, 0.8, 32);
    const daisSlateMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.2, roughness: 0.45 });
    const lowerDais = new THREE.Mesh(lowerDaisGeo, daisSlateMat);
    lowerDais.position.set(0, 0.4, 0);
    scene.add(lowerDais);

    const upperDaisGeo = new THREE.CylinderGeometry(3.6, 4.0, 0.6, 32);
    const upperDaisMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.25, roughness: 0.4 });
    const upperDais = new THREE.Mesh(upperDaisGeo, upperDaisMat);
    upperDais.position.set(0, 1.05, 0);
    scene.add(upperDais);

    const trimGeo = new THREE.TorusGeometry(3.8, 0.06, 12, 36);
    trimGeo.rotateX(Math.PI / 2);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.75, roughness: 0.2 });
    const daisTrim = new THREE.Mesh(trimGeo, brassMat);
    daisTrim.position.set(0, 1.36, 0);
    scene.add(daisTrim);

    // Speaker's Chair & Desk
    const speakerChairGeo = new THREE.BoxGeometry(1.2, 2.0, 0.5);
    const speakerChair = new THREE.Mesh(speakerChairGeo, daisSlateMat);
    speakerChair.position.set(0, 2.3, -1.5);
    scene.add(speakerChair);

    const speakerDeskGeo = new THREE.BoxGeometry(2.4, 0.9, 0.8);
    const speakerDesk = new THREE.Mesh(speakerDeskGeo, daisSlateMat);
    speakerDesk.position.set(0, 1.75, -0.4);
    scene.add(speakerDesk);

    // B. Table of the House (Well of the House)
    const houseTableGeo = new THREE.BoxGeometry(4.4, 0.6, 1.6);
    const houseTableMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.15, roughness: 0.5 });
    const houseTable = new THREE.Mesh(houseTableGeo, houseTableMat);
    houseTable.position.set(0, 0.3, 3.2);
    scene.add(houseTable);

    // C. Floor Base & Well Boundaries
    const floorGeo = new THREE.RingGeometry(4.8, 46, 48);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x64748b, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.07 
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = 0.02;
    scene.add(floor);

    // Well boundary line
    const wellRingGeo = new THREE.TorusGeometry(7.2, 0.06, 12, 48);
    wellRingGeo.rotateX(Math.PI / 2);
    const wellRingMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.6 });
    const wellRing = new THREE.Mesh(wellRingGeo, wellRingMat);
    wellRing.position.y = 0.03;
    scene.add(wellRing);

    // --- 7. Selection Ring & Beacon Indicator ---
    const selectionRingGeo = new THREE.RingGeometry(0.75, 1.05, 32);
    selectionRingGeo.rotateX(-Math.PI / 2);
    const selectionRingMat = new THREE.MeshBasicMaterial({ 
      color: 0xf59e0b, 
      side: THREE.DoubleSide 
    });
    const selectionRing = new THREE.Mesh(selectionRingGeo, selectionRingMat);
    selectionRing.visible = false;
    scene.add(selectionRing);

    const beaconGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.8, 8);
    beaconGeo.translate(0, 1.4, 0);
    const beaconMat = new THREE.MeshBasicMaterial({ 
      color: 0xf59e0b, 
      transparent: true, 
      opacity: 0.7 
    });
    const selectionBeacon = new THREE.Mesh(beaconGeo, beaconMat);
    selectionBeacon.visible = false;
    scene.add(selectionBeacon);

    // --- 8. Refined Parliamentary Bench & Chair Geometry ---
    const PRESIDING_CHAIR = new THREE.Vector3(0, 2.3, -1.5);

    // Cushion: Local +Z is front (facing dais), local -Z is rear
    const cushionGeo = new THREE.BoxGeometry(0.82, 0.22, 0.62);
    cushionGeo.translate(0, 0.11, 0.02);

    // Backrest: positioned behind cushion along -Z
    const backrestGeo = new THREE.BoxGeometry(0.82, 0.54, 0.16);
    backrestGeo.translate(0, 0.39, -0.32);

    // Armrests / bench dividers: on sides
    const armLeftGeo = new THREE.BoxGeometry(0.06, 0.30, 0.46);
    armLeftGeo.translate(-0.41, 0.25, 0.02);
    const armRightGeo = new THREE.BoxGeometry(0.06, 0.30, 0.46);
    armRightGeo.translate(0.41, 0.25, 0.02);

    // Pedestal beneath seat
    const pedestalGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.28, 10);
    pedestalGeo.translate(0, -0.10, 0.02);

    const seatSharedGeometry = mergeGeometries([
      cushionGeo, 
      backrestGeo, 
      armLeftGeo, 
      armRightGeo, 
      pedestalGeo
    ]);

    cushionGeo.dispose();
    backrestGeo.dispose();
    armLeftGeo.dispose();
    armRightGeo.dispose();
    pedestalGeo.dispose();

    // Front Desk / Ledger: In front of member along local +Z facing the dais
    const deskTopGeo = new THREE.BoxGeometry(0.84, 0.08, 0.28);
    deskTopGeo.translate(0, 0.38, 0.48);

    const deskFrontGeo = new THREE.BoxGeometry(0.84, 0.38, 0.04);
    deskFrontGeo.translate(0, 0.19, 0.60);

    const deskStanchionGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.38, 8);
    deskStanchionGeo.translate(0, 0.19, 0.46);

    const deskSharedGeometry = mergeGeometries([
      deskTopGeo, 
      deskFrontGeo, 
      deskStanchionGeo
    ]);

    deskTopGeo.dispose();
    deskFrontGeo.dispose();
    deskStanchionGeo.dispose();

    const benchWoodMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Dignified dark slate/teak bench ledger
      metalness: 0.18,
      roughness: 0.45,
    });

    // --- 9. Procedural Parliamentary Bloc Seating Distribution ---
    const ndaList = seats.filter((s) => s.alliance === "NDA");
    const othersList = seats.filter((s) => s.alliance !== "NDA" && s.alliance !== "INDIA");
    const indiaList = seats.filter((s) => s.alliance === "INDIA");

    const numRows = chamber === "Lok Sabha" ? 8 : 6;
    const innerRadius = 8.6;
    const rowSpacing = 4.2;

    // Distribute seats per row proportionally
    const rowWeights: number[] = [];
    let totalWeight = 0;
    for (let r = 0; r < numRows; r++) {
      const w = chamber === "Lok Sabha" ? 18 + r * 14 : 16 + r * 10;
      rowWeights.push(w);
      totalWeight += w;
    }

    function distribute(list: SeatData[], weights: number[], totalW: number): number[] {
      const result: number[] = [];
      let allocated = 0;
      for (let r = 0; r < weights.length; r++) {
        let count = Math.round((weights[r] / totalW) * list.length);
        if (r === weights.length - 1) {
          count = list.length - allocated;
        }
        allocated += count;
        result.push(Math.max(0, count));
      }
      return result;
    }

    const ndaPerRow = distribute(ndaList, rowWeights, totalWeight);
    const othersPerRow = distribute(othersList, rowWeights, totalWeight);
    const indiaPerRow = distribute(indiaList, rowWeights, totalWeight);

    // Arc geometry calculations with authentic radial gangway aisles
    const startAngle = Math.PI * 0.12; // Treasury wing boundary (~21.6 deg)
    const endAngle = Math.PI * 0.88;   // Opposition wing boundary (~158.4 deg)
    const totalSpan = endAngle - startAngle;

    // Two radial aisles separating Treasury Wing, Crossbenches, and Opposition Wing
    const aisleGap = 0.024 * Math.PI; // ~4.3 deg aisle gap
    const activeSpan = totalSpan - 2 * aisleGap;

    const totalCount = Math.max(seats.length, 1);
    const ndaSpan = activeSpan * (ndaList.length / totalCount);
    const othersSpan = activeSpan * (othersList.length / totalCount);
    const indiaSpan = activeSpan * (indiaList.length / totalCount);

    const seatMeshes: THREE.Mesh[] = [];
    let ndaIdx = 0;
    let othersIdx = 0;
    let indiaIdx = 0;

    for (let r = 0; r < numRows; r++) {
      const radius = innerRadius + r * rowSpacing;
      const yElevation = 0.45 + r * 0.48; // Stepped amphitheater tier riser

      // 1. Treasury Wing (NDA)
      const countNDA = ndaPerRow[r];
      for (let i = 0; i < countNDA; i++) {
        if (ndaIdx >= ndaList.length) break;
        const seatData = ndaList[ndaIdx++];
        const angle = startAngle + (i + 0.5) * (ndaSpan / Math.max(countNDA, 1));
        createSeatMesh(seatData, angle, radius, yElevation, ndaMaterial, "NDA");
      }

      // 2. Center Crossbenches (Others / Regional)
      const countOthers = othersPerRow[r];
      const othersStartAngle = startAngle + ndaSpan + aisleGap;
      for (let i = 0; i < countOthers; i++) {
        if (othersIdx >= othersList.length) break;
        const seatData = othersList[othersIdx++];
        const angle = othersStartAngle + (i + 0.5) * (othersSpan / Math.max(countOthers, 1));
        createSeatMesh(seatData, angle, radius, yElevation, othersMaterial, "Others");
      }

      // 3. Opposition Wing (INDIA)
      const countINDIA = indiaPerRow[r];
      const indiaStartAngle = othersStartAngle + othersSpan + aisleGap;
      for (let i = 0; i < countINDIA; i++) {
        if (indiaIdx >= indiaList.length) break;
        const seatData = indiaList[indiaIdx++];
        const angle = indiaStartAngle + (i + 0.5) * (indiaSpan / Math.max(countINDIA, 1));
        createSeatMesh(seatData, angle, radius, yElevation, indiaMaterial, "INDIA");
      }
    }

    function createSeatMesh(
      seatData: SeatData, 
      angle: number, 
      radius: number, 
      yElevation: number, 
      defaultMaterial: THREE.Material,
      alliance: string
    ) {
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Create each seat as a THREE.Group() at the calculated seat coordinates
      const seatGroup = new THREE.Group();
      seatGroup.position.set(x, yElevation, z);

      // Calculate direction from seat 3D position toward the Presiding Chair
      const direction = PRESIDING_CHAIR.clone().sub(new THREE.Vector3(x, yElevation, z));
      direction.y = 0;
      direction.normalize();

      // Orient the entire seat group so front (+Z) points along direction
      seatGroup.rotation.y = Math.atan2(direction.x, direction.z);

      // A. Alliance-colored seat cushion & backrest
      const seatMesh = new THREE.Mesh(seatSharedGeometry, defaultMaterial);
      seatMesh.userData = { 
        seatData, 
        seatGroup,
        originalY: yElevation, 
        alliance,
        targetScale: 1.0,
      };
      seatGroup.add(seatMesh);

      // B. Bench desk / table ledge in front facing the dais
      const deskMesh = new THREE.Mesh(deskSharedGeometry, benchWoodMat);
      seatGroup.add(deskMesh);

      scene.add(seatGroup);
      seatMeshes.push(seatMesh);
    }

    // --- 10. Live Alliance Filter Update Engine ---
    filterUpdateRef.current = (filter: string) => {
      seatMeshes.forEach((mesh) => {
        const alliance = mesh.userData.alliance;
        const isMatch = filter === "All" || alliance === filter;
        mesh.userData.targetScale = isMatch ? 1.0 : 0.85;

        if (isMatch) {
          if (alliance === "NDA") mesh.material = ndaMaterial;
          else if (alliance === "INDIA") mesh.material = indiaMaterial;
          else mesh.material = othersMaterial;
        } else {
          if (alliance === "NDA") mesh.material = ndaDimMaterial;
          else if (alliance === "INDIA") mesh.material = indiaDimMaterial;
          else mesh.material = othersDimMaterial;
        }
      });
    };

    // Apply active alliance if already selected
    if (activeAlliance !== "All") {
      filterUpdateRef.current(activeAlliance);
    }

    // --- 11. 3D Selection Sync Engine ---
    let currentSelectedMesh: THREE.Mesh | null = null;

    selectSeatIn3DRef.current = (slug: string | null) => {
      if (!slug) {
        if (currentSelectedMesh) {
          const group = currentSelectedMesh.userData.seatGroup;
          if (group) group.position.y = currentSelectedMesh.userData.originalY;
          currentSelectedMesh = null;
        }
        selectionRing.visible = false;
        selectionBeacon.visible = false;
        return;
      }

      const match = seatMeshes.find((m) => m.userData.seatData.slug === slug);
      if (match) {
        if (currentSelectedMesh && currentSelectedMesh !== match) {
          const prevGroup = currentSelectedMesh.userData.seatGroup;
          if (prevGroup) prevGroup.position.y = currentSelectedMesh.userData.originalY;
        }
        currentSelectedMesh = match;
        const group = match.userData.seatGroup;
        if (group) {
          // Elevate selected seat assembly slightly
          group.position.y = match.userData.originalY + 0.35;

          // Position halo ring and beacon at the seat group's coordinates
          selectionRing.position.set(group.position.x, match.userData.originalY + 0.05, group.position.z);
          selectionRing.visible = true;

          selectionBeacon.position.set(group.position.x, match.userData.originalY, group.position.z);
          selectionBeacon.visible = true;
        }
      }
    };

    // --- 12. Pointer Interaction Engine (Touch vs Drag Discrimination) ---
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let currentHoveredMesh: THREE.Mesh | null = null;

    let pointerDownX = 0;
    let pointerDownY = 0;
    let pointerDownTime = 0;
    let isDraggingGesture = false;

    const onPointerDown = (event: PointerEvent) => {
      pointerDownX = event.clientX;
      pointerDownY = event.clientY;
      pointerDownTime = performance.now();
      isDraggingGesture = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      const dist = Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY);
      if (dist > 8) {
        isDraggingGesture = true;
      }

      // Desktop hover raycasting (never triggers on touch move to save battery)
      if (event.pointerType === "mouse" && !isDraggingGesture) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(seatMeshes, false);

        if (intersects.length > 0) {
          const hitMesh = intersects[0].object as THREE.Mesh;
          if (currentHoveredMesh !== hitMesh) {
            if (currentHoveredMesh && currentHoveredMesh !== currentSelectedMesh) {
              currentHoveredMesh.scale.set(1, 1, 1);
            }
            currentHoveredMesh = hitMesh;
            currentHoveredMesh.scale.set(1.18, 1.18, 1.18);
            setHoveredSeat(hitMesh.userData.seatData);
          }
        } else {
          if (currentHoveredMesh && currentHoveredMesh !== currentSelectedMesh) {
            currentHoveredMesh.scale.set(1, 1, 1);
            currentHoveredMesh = null;
            setHoveredSeat(null);
          }
        }
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      const dist = Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY);
      const elapsed = performance.now() - pointerDownTime;

      // STRICT TAP CLASSIFICATION: Only select seat if pointer moved <= 8px and duration <= 350ms
      // Dragging the chamber to orbit NEVER triggers seat selection!
      if (dist <= 8 && elapsed <= 350 && !isDraggingGesture) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(seatMeshes, false);

        if (intersects.length > 0) {
          const hitMesh = intersects[0].object as THREE.Mesh;
          const seatData = hitMesh.userData.seatData;
          handleSelectSeat(seatData);

          const group = hitMesh.userData.seatGroup || hitMesh;
          // Gentle camera pivot towards selected seat
          controls.target.lerp(
            new THREE.Vector3(group.position.x * 0.35, group.position.y, group.position.z * 0.35),
            0.4
          );
          controls.update();
        } else {
          // Tapping empty space closes selected seat modal
          handleSelectSeat(null);
        }
      }
      isDraggingGesture = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("pointerdown", onPointerDown);
    domElement.addEventListener("pointermove", onPointerMove);
    domElement.addEventListener("pointerup", onPointerUp);

    // --- 13. Responsive Resize Handling ---
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight || 460;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // --- 14. Render Animation Loop ---
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Camera lerp animation
      if (isTransitioningCamera) {
        const elapsed = performance.now() - transitionStartTime;
        const progress = Math.min(elapsed / transitionDuration, 1);
        const ease = easeInOutCubic(progress);

        camera.position.lerpVectors(camStartPos, camEndPos, ease);
        controls.target.lerpVectors(targetStartPos, targetEndPos, ease);
        controls.update();

        if (progress >= 1) {
          isTransitioningCamera = false;
        }
      } else {
        controls.update();
      }

      // Smooth scale interpolation for alliance filter transitions
      seatMeshes.forEach((mesh) => {
        const target = mesh.userData.targetScale || 1.0;
        const group = mesh.userData.seatGroup;
        if (group && Math.abs(group.scale.x - target) > 0.005) {
          group.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
        }
      });

      // Subtle pulse animation on selected beacon
      if (selectionBeacon.visible) {
        const time = performance.now() * 0.003;
        beaconMat.opacity = 0.5 + Math.sin(time) * 0.25;
      }

      renderer.render(scene, camera);
    };
    animate();

    // --- 15. Robust Memory & Lifecycle Disposal ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("pointerdown", onPointerDown);
      domElement.removeEventListener("pointermove", onPointerMove);
      domElement.removeEventListener("pointerup", onPointerUp);

      controls.dispose();
      renderer.dispose();

      // Dispose shared geometries
      seatSharedGeometry.dispose();
      deskSharedGeometry.dispose();
      benchWoodMat.dispose();
      lowerDaisGeo.dispose();
      upperDaisGeo.dispose();
      trimGeo.dispose();
      speakerChairGeo.dispose();
      speakerDeskGeo.dispose();
      houseTableGeo.dispose();
      floorGeo.dispose();
      wellRingGeo.dispose();
      selectionRingGeo.dispose();
      beaconGeo.dispose();

      // Dispose materials
      ndaMaterial.dispose();
      indiaMaterial.dispose();
      othersMaterial.dispose();
      ndaDimMaterial.dispose();
      indiaDimMaterial.dispose();
      othersDimMaterial.dispose();
      daisSlateMat.dispose();
      upperDaisMat.dispose();
      brassMat.dispose();
      houseTableMat.dispose();
      floorMat.dispose();
      wellRingMat.dispose();
      selectionRingMat.dispose();
      beaconMat.dispose();

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [seats, chamber, activeAlliance, handleSelectSeat]);

  return (
    <div className={cn("relative w-full rounded-2xl bg-card border border-border shadow-sm overflow-hidden", className)}>
      {/* Header Bar with Dynamic Alliance Tally & Chamber Context */}
      <div className="p-4 sm:p-6 border-b border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
              <Landmark className="h-3 w-3 text-amber-600" /> 3D Chamber Seating
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {chamber} ({seats.length} Seats)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
            Parliamentary Chamber Seating
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            3D seat distribution visualization • Drag to rotate • Pinch/scroll to zoom • Tap seat for details
          </p>
        </div>

        {/* Live Alliance Filter Buttons (Directly controls 3D scene) */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap" role="toolbar" aria-label="Alliance seating filters">
          <button
            onClick={() => handleAllianceFilter("All")}
            aria-pressed={activeAlliance === "All"}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border min-h-[36px]",
              activeAlliance === "All"
                ? "bg-foreground text-background border-foreground shadow-xs"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 border-border"
            )}
          >
            All ({allianceStats.total})
          </button>
          <button
            onClick={() => handleAllianceFilter("NDA")}
            aria-pressed={activeAlliance === "NDA"}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border min-h-[36px]",
              activeAlliance === "NDA"
                ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                : "bg-card text-amber-800 border-amber-500/30 hover:bg-amber-500/10"
            )}
          >
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            NDA: {allianceStats.NDA}
          </button>
          <button
            onClick={() => handleAllianceFilter("INDIA")}
            aria-pressed={activeAlliance === "INDIA"}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border min-h-[36px]",
              activeAlliance === "INDIA"
                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                : "bg-card text-blue-800 border-blue-600/30 hover:bg-blue-600/10"
            )}
          >
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            INDIA: {allianceStats.INDIA}
          </button>
          <button
            onClick={() => handleAllianceFilter("Others")}
            aria-pressed={activeAlliance === "Others"}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border min-h-[36px]",
              activeAlliance === "Others"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-card text-emerald-800 border-emerald-600/30 hover:bg-emerald-600/10"
            )}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            Others: {allianceStats.Others}
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] cursor-grab active:cursor-grabbing bg-gradient-to-b from-card via-background to-background select-none">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-card/85 backdrop-blur-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
            <p className="text-sm font-semibold text-foreground">Constructing 3D Parliament Chamber...</p>
            <p className="text-xs text-muted-foreground mt-1">Arranging parliamentary seating blocs</p>
          </div>
        )}

        {/* Error Fallback */}
        {error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm p-6 text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-2" />
            <h3 className="text-sm font-bold text-foreground">Unable to Load 3D Chamber</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Retry Loading
            </button>
          </div>
        )}

        {/* Three.js Mount Container */}
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating Camera Preset Dock (Compact Segmented Pill) */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center p-1 rounded-xl bg-background/90 backdrop-blur-md border border-border shadow-md" role="toolbar" aria-label="Camera preset views">
          <button
            onClick={() => handlePresetClick("overview")}
            aria-label="Overview perspective view"
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px]",
              activePreset === "overview"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => handlePresetClick("dais")}
            aria-label="Speaker's Dais viewpoint"
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px]",
              activePreset === "dais"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Dais</span>
          </button>
          <button
            onClick={() => handlePresetClick("top")}
            aria-label="Top-down architectural plan"
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px]",
              activePreset === "top"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Top Plan</span>
          </button>
        </div>

        {/* Desktop-Only Hover Tooltip HUD */}
        {hoveredSeat && !selectedSeat && (
          <div className="hidden sm:flex absolute top-4 right-4 z-10 max-w-xs p-3 rounded-xl bg-background/95 backdrop-blur-md border border-border shadow-xl pointer-events-none items-center gap-2.5">
            <div 
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: hoveredSeat.color }}
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{hoveredSeat.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {hoveredSeat.partyName} ({hoveredSeat.alliance}) • {hoveredSeat.constituency}
              </p>
            </div>
          </div>
        )}

        {/* Selected Member Detail Card (Responsive Bottom Sheet on Mobile, Floating Card on Desktop) */}
        {selectedSeat && (
          <div className="fixed bottom-3 left-3 right-3 sm:absolute sm:bottom-4 sm:right-4 sm:left-auto sm:w-84 z-30 p-3.5 sm:p-4 rounded-2xl bg-card/98 backdrop-blur-md border border-border shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-3 min-w-0">
                <CivicAvatar
                  src={selectedSeat.photo}
                  alt={selectedSeat.name}
                  size="md"
                  shape="circle"
                  className="border border-border flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-foreground truncate">{selectedSeat.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span 
                      className="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: selectedSeat.color }}
                    >
                      {selectedSeat.partyName}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {selectedSeat.alliance} Bloc
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSelectSeat(null)}
                aria-label="Close representative details"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground border-t border-border/60 pt-2.5 mb-3">
              <div>
                <span className="block text-[10px] uppercase font-semibold text-muted-foreground/70">Constituency</span>
                <span className="font-medium text-foreground truncate block">{selectedSeat.constituency}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-semibold text-muted-foreground/70">State / UT</span>
                <span className="font-medium text-foreground truncate block">{selectedSeat.state}</span>
              </div>
            </div>

            <Link
              href={`/politicians/${selectedSeat.slug}`}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity min-h-[44px]"
            >
              <span>View Full Representative Profile</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Footer Info & Civic Attribution */}
      <div className="px-4 py-3 bg-muted/15 border-t border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-muted-foreground gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-xs" /> National Democratic Alliance (NDA)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-xs" /> INDIA Bloc
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 shadow-xs" /> Unaligned / Regional
          </span>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-[11px] font-bold text-foreground border border-border">
            Majority Target: {chamber === "Lok Sabha" ? "272 Seats" : "123 Seats"}
          </span>
        </div>
      </div>
    </div>
  );
}
