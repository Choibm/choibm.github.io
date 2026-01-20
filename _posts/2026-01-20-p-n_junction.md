---
layout: post
title: "P-N junction"
date: 2026-01-20
excerpt: "Beginning of my Studying blog"
categories: Semiconductors MSE
---

The P-N junction is the basic component of semiconductor devices.

I'm not going to explain exactly what P-type and N-type semiconductors are in depth, but to summarize: **P-type** has more holes and **N-type** has more electrons.

## **1. "Diffusion" and "Drift"**

### 1. Diffusion: The flow caused by variation in concentration
The movement of particles from an area of higher concentration to an area of lower concentration.

* **Cause:** Concentration gradient ($\frac{dC}{dx}$) between the P-side and N-side.
* **Goal:** This movement tries to eliminate the separation between P and N.

### 2. Drift: The movement caused by electric field
The movement caused by the built-in electric field created by the exposed ions (Depletion Region). This movement opposes diffusion and keeps the P and N regions separated.

> **Formula:** $J_{drift} = qn\mu E$

### **Summary: Drift vs. Diffusion in Equilibrium**

| Feature | **Diffusion** | **Drift** |
| :--- | :--- | :--- |
| **Driving Force** | Concentration Gradient ($\Delta C$) | Electric Field ($E$) |
| **Primary Carriers** | **Majority Carriers**<br>(Holes in P, Electrons in N) | **Minority Carriers**<br>(Holes in N, Electrons in P) |
| **Direction for Holes** | $P \rightarrow N$ | $N \rightarrow P$ |
| **Direction for Electrons** | $N \rightarrow P$ | $P \rightarrow N$ |
| **Physics Formula** | $J_{diff} \propto \frac{dn}{dx}$ | $J_{drift} \propto q\mu E$ |

In an unbiased junction (Equilibrium), these two currents cancel each other out exactly.

$$J_{total} = J_{drift} + J_{diff} = 0$$

* In **Forward Bias**, the diffusion is greater.
* In **Reverse Bias**, the drift is greater.

---

## **2. Biased P-N junction**

{% include pn-junction-sim.html %}

### **Forward Bias**

#### Depletion Region
In Forward bias, the depletion region's width **decreases**.

1.  External voltage pushes Holes and Electrons.
2.  The pushed carriers flow into the depletion region. (To make an example: Let's say the hole flows to the acceptor $N_A^-$, it would then be neutralized).
3.  As a result, the depletion region's width decreases. (The speed of neutralization gets faster when forward bias is applied).

The expression for the depletion region's width (applicable for both forward and reverse bias) is:

$$W = \sqrt{\frac{2\epsilon}{q} \left( \frac{1}{N_A} + \frac{1}{N_D} \right) (V_{bi} - V_{applied})}$$

#### Energy Band Diagram
The positive voltage to the P-side lowers the electron energy levels, and the negative voltage to the N-side lowers the hole energy levels. Consequently, the **potential barrier gets lower**.



#### Current: "About minority carriers"
1.  The potential barrier is lowered, so the carriers can jump to the other side.
2.  After jumping, the carriers become **"Minority Carriers"** (hole in N-type and electron in P-type).
3.  As the minority carriers go deeper into the other side, they collide with the majority carriers and recombine.

These steps explain how the forward bias makes current flow.

---

### **Reverse Bias**

#### Depletion Region
In reverse bias, the depletion region's width **increases**.

1.  The voltage pulls holes and electrons away from the junction.
2.  As the carriers are pulled, the depletion region doesn't get enough carriers to neutralize the ions.
3.  As a result, the depletion region's width increases.

#### Energy Band Diagram
In contrast to forward bias, the **potential barrier gets higher**. The mechanism is the opposite of the forward bias lowering effect.



#### Current: "Reverse Saturation Current"
In reverse bias, current flows too, but it behaves differently. The current is constant and is called **"Reverse Saturation Current"**.

1.  Heat constantly creates a few Electron-Hole Pairs (EHP).
2.  The minority carriers wander randomly, and some of them reach the depletion region.
3.  The depletion region's electric field sweeps the minority carriers across the junction.

The mechanism of this constant current flow is that the current only depends on the EHP generation rate (therefore, increasing the reverse voltage doesn't significantly increase the current).

![Welcome!](<{{ '/assets/images/2026-01-19_img1.png' | relative_url }}>)