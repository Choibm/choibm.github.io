---
layout: post
title: "P-N junction"
date: 2026-01-20
excerpt: "Beginning of my Studying blog"
categories: Semiconductors MSE
---

P-N junction is the basic component of semiconductor devices.
I'm not going to explain about what is P-type, N-type semiconductor is... to summarize P-type has more holes and N-type has more electrons.

## **1. "Diffusion" and "Drift"**

### 1. Diffusion : The flow caused by variation in the concentration.
The movement of particles from an area of higher concentration to an area of lower concentration.
The cause is concentration gradient (dC/dx) between P-side and N-side. This movement tries to eliminate the seperation between P and N.

### 2. Drift : The movement caused by electric field.
caused by the built-in electric field created by the exposed ions (Depletion Region) and this movement opposes diffusion and keeps the P and N regions separated.
>> J<small>drift</small> =qnμE

### **Summary: Drift vs. Diffusion in Equilibrium**

| Feature | **Diffusion** | **Drift** |
| :--- | :--- | :--- |
| **Driving Force** | Concentration Gradient ($\Delta C$) | Electric Field ($E$) |
| **Primary Carriers** | **Majority Carriers**<br>(Holes in P, Electrons in N) | **Minority Carriers**<br>(Holes in N, Electrons in P) |
| **Direction for Holes** | $P \rightarrow N$ | $N \rightarrow P$ |
| **Direction for Electrons** | $N \rightarrow P$ | $P \rightarrow N$ |
| **Physics Formula** | $J_{diff} \propto \frac{dn}{dx}$ | $J_{drift} \propto q\mu E$ |

In an unbiased junction (Equilibrium), these two currents cancel each other out exactly.

> $$J_{total} = J_{drift} + J_{diff} = 0$$ 

In forward bias the diffusion is greater and in reverse bias the drift is greater. 

## **2. Biased P-N junction**

{% include pn-junction-sim.html %}

## Forward Bias

### Depletion region : In Forwward bias the depletion region's width decreases.
>> 1. External voltage pushes Holes and Electrons.
>> 2. The pushed carriers flow into the depletion region. (To make an example Let's say the hole flows then the acceptor($N_A^-$) then it would be neutralized)  
>> 3. As the result the depletion region's width would be decreased. (The speed of being neutralized is getting faster when forward bias is applied)

>>- ### $$W = \sqrt{\frac{2\epsilon}{q} \left( \frac{1}{N_A} + \frac{1}{N_D} \right) (V_{bi} - V_{applied})}$$

this expression is the deplition region's width (Not only at forward bias also when reverse bias is applied)

### Energy Band Diagram :
>> The positive voltage to the P-side lowers the electron energy levels and the negative voltage to the N-side lowers the hole energy levels. as so the potential barrier gets lower.

### Current : "About minority carriers"
>> 1. The potential barrier is lowered, as so the carriers can jump to the other side.
>> 2. After jumping the carriers become "Minority Carrier"(hole in N-type and electron in P-type)
>> 3. As the minority carriers go deeper into the other side, they collide with the majority carriers and recombine. 

these steps are how the forward bias makes current flow.


## Reverse Bias  

### Depletion region : In reverse bias the depletion region's width increases.
>> 1. The voltage pulls holes and electrons.
>> 2. As the carriers are pulled, the depletion region's don't get enough carriers to neutralize.
>> 3. As the result the depletion region's width would be increased. (The speed of being neutralized is getting slower when reverse bias is applied)

## Energy Band Diagram : 
>> Contrast to forward bias the potential barrier gets higher. The mechanism is contrast to the forward bias getting lower. 

## Current : "Reverse saturation current"
In reverse bias the current flows too. Something different from forward bias is the current is constant and it is called "Reverse saturation current".

>> 1. Heat constantly creates a few electron-hole pairs(EHP).
>> 2. The minority carriers wander randomly and some of them reach the depletion region.
>> 3. The depletion region's electric field sweeps the minority carriers across the junction.

the mechanism of the constant current flow is because the current only depends on the EHP generation rate. (So, ncreasing the reverse voltage doesn't increase the current)


![Welcome!](<{{ '/assets/images/2026-01-19_img1.png' | relative_url }}>)


make this as the markdown text (some texts are not markdown..)