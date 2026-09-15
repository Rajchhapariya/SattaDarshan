"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Link from "next/link";
import Image from "next/image";
import { 
  RotateCw, 
  ZoomIn, 
  Eye, 
  User, 
  ExternalLink, 
  X, 
  Landmark,
  Layers,
  ChevronRight
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

export function ThreeParliamentChamber({ 
  chamber = "Lok Sabha", 
  initialSeats,
  className 
}: ChamberProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [seats, setSeats] = useState<SeatData[]>(initialSeats || []);
  const [loading, setLoading] = useState(!initialSeats);
  const [hoveredSeat, setHoveredSeat] = useState<SeatData | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [activeAlliance, setActiveAlliance] = useState<string>("All");
  const [allianceStats, setAllianceStats] = useState({ NDA: 0, INDIA: 0, Others: 0 });

  // Camera preset ref to call from controls
  const cameraRef = useRef<{
    setOverview: () => void;
    setSpeakerView: () => void;
    setTopDown: () => void;
  } | null>(null);

  // Fetch seat data if not passed directly
  useEffect(() => {
    if (initialSeats && initialSeats.length > 0) {
      setSeats(initialSeats);
      calculateStats(initialSeats);
      return;
    }

    setLoading(true);
    fetch(`/api/parliament/seats?chamber=${encodeURIComponent(chamber)}`)
      .then((res) => res.json())
      .then((data) => {
        const fetchedSeats: SeatData[] = data.seats || [];
        setSeats(fetchedSeats);
        calculateStats(fetchedSeats);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load parliament seats:", err);
        setLoading(false);
      });
  }, [chamber, initialSeats]);

  const calculateStats = (list: SeatData[]) => {
    let nda = 0, india = 0, others = 0;
    list.forEach((s) => {
      if (s.alliance === "NDA") nda++;
      else if (s.alliance === "INDIA") india++;
      else others++;
    });
    setAllianceStats({ NDA: nda, INDIA: india, Others: others });
  };

  // Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container || seats.length === 0) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null; // transparent background

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 48, 65);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Mobile performance guard
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // Don't allow camera under floor
    controls.minDistance = 20;
    controls.maxDistance = 120;
    controls.target.set(0, 0, 5);

    // Camera presets
    cameraRef.current = {
      setOverview: () => {
        camera.position.set(0, 48, 65);
        controls.target.set(0, 0, 5);
        controls.update();
      },
      setSpeakerView: () => {
        camera.position.set(0, 8, -6);
        controls.target.set(0, 6, 25);
        controls.update();
      },
      setTopDown: () => {
        camera.position.set(0, 80, 5);
        controls.target.set(0, 0, 5);
        controls.update();
      },
    };

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    const softLight = new THREE.PointLight(0xffeedd, 1.0, 100);
    softLight.position.set(0, 20, 0);
    scene.add(softLight);

    // Center Dais / Podium (Speaker's Table)
    const daisGeo = new THREE.CylinderGeometry(4.5, 5, 1.5, 32);
    const daisMat = new THREE.MeshStandardMaterial({ 
      color: 0x1e293b, 
      metalness: 0.2, 
      roughness: 0.5 
    });
    const dais = new THREE.Mesh(daisGeo, daisMat);
    dais.position.set(0, 0.75, 0);
    scene.add(dais);

    // Floor Base Ring
    const floorGeo = new THREE.RingGeometry(5.2, 45, 48);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x64748b, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.08 
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = 0.02;
    scene.add(floor);

    // Create Seats in concentric horseshoe arcs
    const seatMeshes: THREE.Mesh[] = [];
    const seatGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.9, 16);

    const totalSeats = seats.length;
    const numRows = chamber === "Lok Sabha" ? 8 : 6;
    const innerRadius = 8;
    const rowSpacing = 4.2;

    // Distribute seats per row proportionally
    let seatIndex = 0;
    const seatsPerRow: number[] = [];
    let totalCap = 0;
    for (let r = 0; r < numRows; r++) {
      const cap = Math.floor(18 + r * 14);
      seatsPerRow.push(cap);
      totalCap += cap;
    }

    const scaleFactor = totalSeats / totalCap;

    for (let r = 0; r < numRows; r++) {
      const radius = innerRadius + r * rowSpacing;
      const countInThisRow = Math.min(
        Math.round(seatsPerRow[r] * scaleFactor),
        totalSeats - seatIndex
      );

      // Arc spans from -160 degrees to +20 degrees (amphitheater arc opening toward Speaker)
      const startAngle = Math.PI * 0.12;
      const endAngle = Math.PI * 0.88;
      const angleStep = (endAngle - startAngle) / Math.max(countInThisRow - 1, 1);

      for (let i = 0; i < countInThisRow; i++) {
        if (seatIndex >= totalSeats) break;

        const seatData = seats[seatIndex];
        const angle = startAngle + i * angleStep;

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = 0.5 + r * 0.45; // slight amphitheater tier height step

        const colorHex = seatData.color ? parseInt(seatData.color.replace("#", "0x"), 16) : 0x64748b;
        const material = new THREE.MeshStandardMaterial({
          color: colorHex,
          roughness: 0.3,
          metalness: 0.1,
          emissive: colorHex,
          emissiveIntensity: 0.15,
        });

        const seatMesh = new THREE.Mesh(seatGeometry, material);
        seatMesh.position.set(x, y, z);
        seatMesh.userData = { seatData, originalY: y, originalColor: colorHex };

        scene.add(seatMesh);
        seatMeshes.push(seatMesh);

        seatIndex++;
      }
    }

    // Raycasting for pointer interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let currentHoveredMesh: THREE.Mesh | null = null;

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(seatMeshes);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        if (currentHoveredMesh !== hitMesh) {
          // Reset previous
          if (currentHoveredMesh) {
            currentHoveredMesh.scale.set(1, 1, 1);
            const origColor = currentHoveredMesh.userData.originalColor;
            (currentHoveredMesh.material as THREE.MeshStandardMaterial).emissive.setHex(origColor);
            (currentHoveredMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15;
          }
          currentHoveredMesh = hitMesh;
          currentHoveredMesh.scale.set(1.4, 1.4, 1.4);
          (currentHoveredMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xffffff);
          (currentHoveredMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
          setHoveredSeat(currentHoveredMesh.userData.seatData);
        }
      } else {
        if (currentHoveredMesh) {
          currentHoveredMesh.scale.set(1, 1, 1);
          const origColor = currentHoveredMesh.userData.originalColor;
          (currentHoveredMesh.material as THREE.MeshStandardMaterial).emissive.setHex(origColor);
          (currentHoveredMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15;
          currentHoveredMesh = null;
          setHoveredSeat(null);
        }
      }
    };

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(seatMeshes);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const seatData = hitMesh.userData.seatData;
        setSelectedSeat(seatData);

        // Smooth camera tilt towards selected seat
        controls.target.set(hitMesh.position.x * 0.4, hitMesh.position.y, hitMesh.position.z * 0.4);
        controls.update();
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousemove", handlePointerMove);
    domElement.addEventListener("click", handleClick);

    // Responsive Resize handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("mousemove", handlePointerMove);
      domElement.removeEventListener("click", handleClick);
      controls.dispose();
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [seats, chamber]);

  return (
    <div className={cn("relative w-full rounded-2xl bg-card border border-border/80 shadow-sm overflow-hidden", className)}>
      {/* Header Bar with Chamber Info & Alliance Tally */}
      <div className="p-4 sm:p-6 border-b border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Landmark className="h-3 w-3" /> 3D Chamber Seating
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {chamber} ({seats.length} Seats)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
            Parliamentary Chamber Seating
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Drag to rotate in 3D • Pinch/scroll to zoom • Tap any seat to view representative details
          </p>
        </div>

        {/* Live Alliance Counters */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setActiveAlliance("All")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
              activeAlliance === "All"
                ? "bg-foreground text-background border-foreground shadow-sm"
                : "bg-background text-muted-foreground hover:text-foreground border-border"
            )}
          >
            All ({seats.length})
          </button>
          <button
            onClick={() => setActiveAlliance("NDA")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
              activeAlliance === "NDA"
                ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
            )}
          >
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            NDA: {allianceStats.NDA}
          </button>
          <button
            onClick={() => setActiveAlliance("INDIA")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
              activeAlliance === "INDIA"
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
            )}
          >
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            INDIA: {allianceStats.INDIA}
          </button>
          <button
            onClick={() => setActiveAlliance("Others")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
              activeAlliance === "Others"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
            )}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Others: {allianceStats.Others}
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[540px] cursor-grab active:cursor-grabbing bg-gradient-to-b from-card to-background">
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-card/80 backdrop-blur-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
            <p className="text-sm font-medium text-muted-foreground">Constructing 3D Parliament Chamber...</p>
          </div>
        )}

        <div ref={mountRef} className="w-full h-full" />

        {/* Floating Camera Preset Controls */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 bg-background/80 backdrop-blur-md p-1.5 rounded-xl border border-border/80 shadow-md">
          <button
            onClick={() => cameraRef.current?.setOverview()}
            title="Overview Angle"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Eye className="h-3.5 w-3.5 text-primary" /> Overview
          </button>
          <button
            onClick={() => cameraRef.current?.setSpeakerView()}
            title="Speaker's Dais View"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Layers className="h-3.5 w-3.5 text-primary" /> Dais Angle
          </button>
          <button
            onClick={() => cameraRef.current?.setTopDown()}
            title="Top Down Layout"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <RotateCw className="h-3.5 w-3.5 text-primary" /> Top Plan
          </button>
        </div>

        {/* Real-time Hover Tooltip */}
        {hoveredSeat && !selectedSeat && (
          <div className="absolute top-4 right-4 z-10 max-w-xs p-3 rounded-xl bg-background/95 backdrop-blur-md border border-border shadow-xl pointer-events-none transition-all">
            <div className="flex items-center gap-2.5">
              <div 
                className="h-3 w-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: hoveredSeat.color }}
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{hoveredSeat.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {hoveredSeat.partyName} • {hoveredSeat.constituency}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Selected Member Detail Modal Card */}
        {selectedSeat && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-20 p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <CivicAvatar
                  src={selectedSeat.photo}
                  alt={selectedSeat.name}
                  size="md"
                  shape="circle"
                  className="border border-border flex-shrink-0"
                />
                <div>
                  <h4 className="font-bold text-sm text-foreground line-clamp-1">{selectedSeat.name}</h4>
                  <span 
                    className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold text-white mt-0.5"
                    style={{ backgroundColor: selectedSeat.color }}
                  >
                    {selectedSeat.partyName} ({selectedSeat.alliance})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSeat(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border/50 pt-2.5 mb-3">
              <div className="flex justify-between">
                <span>Constituency:</span>
                <span className="font-medium text-foreground">{selectedSeat.constituency}</span>
              </div>
              <div className="flex justify-between">
                <span>State / UT:</span>
                <span className="font-medium text-foreground">{selectedSeat.state}</span>
              </div>
              <div className="flex justify-between">
                <span>Seat Index:</span>
                <span className="font-mono font-medium text-foreground">#{selectedSeat.seatNumber}</span>
              </div>
            </div>

            <Link
              href={`/politicians/${selectedSeat.slug}`}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity"
            >
              View Full Profile <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 bg-muted/10 border-t border-border/60 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> National Democratic Alliance (NDA)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> INDIA Bloc
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Unaligned / Regional
          </span>
        </div>
        <span className="text-[11px] font-medium">
          Majority Target: {chamber === "Lok Sabha" ? "272 Seats" : "123 Seats"}
        </span>
      </div>
    </div>
  );
}
