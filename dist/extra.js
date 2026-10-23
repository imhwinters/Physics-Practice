// Additional original questions. These are distinct problems, not numeric variants.
const extraMCQ=[
[
['A car moves at 6 m/s for 4 s, then at −2 m/s for 3 s. Its displacement is:',['18 m','30 m','4 m','−18 m'],0,'Displacement is signed area under v(t): 6(4)+(−2)(3)=18 m.'],
['For t≥0, v(t)=12−3t² in SI units. At the first instant the particle stops, its displacement from t=0 is:',['8 m','12 m','16 m','24 m'],2,'v=0 at t=2 s. Integrate: Δx=∫₀²(12−3t²)dt=[12t−t³]₀²=16 m.'],
['For t≥0, a particle has velocity v(t)=3t²−12t+9 m/s. The total distance traveled between t=0 and t=4 s is:',['4 m','12 m','20 m','24 m'],1,'v=3(t−1)(t−3) changes sign at 1 and 3 s. With antiderivative x=t³−6t²+9t, segment distances are 4, 4, and 4 m, totaling 12 m.']
],
[
['An elevator accelerates upward at a=g/4. The apparent weight of a passenger of mass m is:',['3mg/4','mg','5mg/4','mg/4'],2,'N−mg=ma, so N=m(g+g/4)=5mg/4.'],
['A satellite moves in a circular orbit of radius r around mass M. If the radius becomes 4r, the orbital speed becomes:',['v/4','v/2','2v','4v'],1,'GMm/r²=mv²/r gives v=√(GM/r). At 4r, speed halves.'],
['A mass m initially moves at speed v₀ under the sole force F=−cv² in one dimension, with v>0. Its speed is:',['v₀e^(−ct/m)','v₀/(1+cv₀t/m)','v₀−ct/m','v₀/(1+ct/m)²'],1,'Separate m dv/v²=−c dt. Integration gives 1/v=1/v₀+ct/m and v=v₀/(1+cv₀t/m).']
],
[
['A horizontal force of 10 N acts on a block moving horizontally at 3 m/s in the same direction. Its instantaneous power is:',['3.3 W','13 W','30 W','90 W'],2,'P=F·v=10(3)=30 W.'],
['A spring of constant k is compressed by x. To double the stored energy, the compression must become:',['x/2','√2 x','2x','4x'],1,'U=½kx²; multiplying x by √2 multiplies U by 2.'],
['A small block starts from rest at height h above the bottom of a frictionless vertical circular loop of radius R. Minimum h for maintaining contact at the top is:',['2R','5R/2','3R','7R/2'],1,'At the top, minimum contact requires v²=gR. Energy gives mgh=mg(2R)+½mgR, so h=5R/2.']
],
[
['A force–time graph is triangular, rising from 0 to 8 N and falling back to 0 over a total duration of 3 s. The impulse is:',['6 N·s','12 N·s','24 N·s','48 N·s'],1,'Impulse is area under the graph: ½(3 s)(8 N)=12 N·s.'],
['An isolated object initially at rest explodes into masses m and 2m. If the smaller fragment has kinetic energy K, the larger has:',['K/4','K/2','K','2K'],1,'Their momenta have equal magnitudes. K=p²/(2m); doubling the mass halves the kinetic energy at fixed momentum.'],
['Two equal masses collide elastically on a frictionless plane. One was initially at rest. If both final velocities are nonzero, the angle between them is:',['0°','45°','90°','180°'],2,'Momentum gives v⃗₀=v⃗₁+v⃗₂; energy gives v₀²=v₁²+v₂². Squaring the vector equation implies v⃗₁·v⃗₂=0.']
],
[
['A wheel has angular velocity ω(t)=4t³ in SI units. Its angular acceleration at t=2 s is:',['16 rad/s²','24 rad/s²','32 rad/s²','48 rad/s²'],3,'α=dω/dt=12t², giving 48 rad/s² at 2 s.'],
['A thin hoop and a solid disk have equal mass and radius. The same net torque acts on each. The ratio αdisk/αhoop is:',['1/2','1','2','4'],2,'α=τ/I. Ihoop=MR² and Idisk=MR²/2, so the disk accelerates twice as much.'],
['A mass m hangs from a string wound around a solid disk of mass M and radius R. The string does not slip and the fixed axle is frictionless. The mass’s downward acceleration is:',['mg/(m+M)','mg/(m+M/2)','g','mg/(m+2M)'],1,'For the mass, mg−T=ma. For the disk, TR=(MR²/2)(a/R), so T=Ma/2. Solve for a=mg/(m+M/2).']
],
[
['A rotating body has constant moment of inertia I. If its angular speed triples, its rotational kinetic energy becomes:',['3K','6K','9K','K/3'],2,'K=½Iω², so tripling ω multiplies K by nine.'],
['A satellite is in a circular orbit of radius r around mass M. Its total mechanical energy is:',['−GMm/r','−GMm/(2r)','GMm/(2r)','0'],1,'K=GMm/(2r) and U=−GMm/r. Thus E=−GMm/(2r).'],
['A solid disk of mass m and radius R slides with center speed v₀ and no rotation on a rough horizontal floor. When it first rolls without slipping, its center speed is:',['v₀/2','2v₀/3','3v₀/4','v₀'],1,'Friction changes v to v₀−ft/m and ω to fRt/I. With I=mR²/2 and v=ωR, v₀−ft/m=2ft/m, hence v=2v₀/3.']
],
[
['An ideal mass–spring oscillator has total energy E and amplitude A. If amplitude doubles, total energy becomes:',['E','2E','4E','8E'],2,'E=½kA², so doubling amplitude quadruples energy.'],
['A simple pendulum of length ℓ oscillates at small amplitude in an elevator accelerating upward at a. Its period is:',['2π√(ℓ/g)','2π√(ℓ/(g+a))','2π√(ℓ/(g−a))','2π√((g+a)/ℓ)'],1,'In the elevator frame, effective downward gravity is g+a. Thus T=2π√(ℓ/(g+a)).'],
['A potential near equilibrium x=0 is U(x)=U₀+cx²+dx⁴, where c,d>0. For infinitesimal oscillations of mass m, angular frequency approaches:',['√(c/m)','√(2c/m)','√(d/m)','√((c+d)/m)'],1,'The linear restoring force is F≈−2cx. The effective spring constant is 2c, giving ω=√(2c/m).']
],
[
['A closed surface encloses a net charge of zero. Which statement must be true?',['Electric field is zero everywhere on it','Net electric flux through it is zero','It contains no charges','Potential is zero everywhere on it'],1,'Gauss’s law states ∮E·dA=Qenc/ε₀=0. Nonzero fields and positive and negative enclosed charges can still exist.'],
['Two identical positive charges Q lie at x=±a. The electric field at the origin is:',['2kQ/a² toward +x','2kQ/a² toward −x','Zero','kQ/a² toward +y'],2,'The equal-magnitude fields point in opposite directions along x and cancel at the midpoint.'],
['An infinite nonconducting slab occupies −a≤x≤a with uniform charge density ρ>0. Inside the slab, the x-component of E is:',['ρa/ε₀','ρx/ε₀','ρx/(2ε₀)','ρa²/(ε₀x)'],1,'For symmetric Gaussian faces at ±x, 2EA=ρ(2xA)/ε₀. Thus Eₓ=ρx/ε₀, including its sign.']
],
[
['Two identical positive charges Q lie at x=±a. Taking V=0 at infinity, the potential at the origin is:',['0','kQ/a','2kQ/a','−2kQ/a'],2,'Potential is a scalar. Add kQ/a from each charge to obtain 2kQ/a even though the field cancels.'],
['A particle of charge q>0 and mass m accelerates from rest through a potential drop ΔV>0. Its speed is:',['qΔV/m','√(qΔV/m)','√(2qΔV/m)','2qΔV/m'],2,'The field does work qΔV. Set ½mv²=qΔV to find v=√(2qΔV/m).'],
['The potential is V(x,y)=a(x²−y²), a>0. At (x,y)=(s,s) with s>0, the electric field points:',['Along +x','Along +y','Along −x and +y','Along +x and −y'],2,'E=−∇V=(−2ax,2ay). At (s,s), its components are equal in magnitude, negative in x and positive in y.']
],
[
['Two identical capacitors C are connected in series. Their equivalent capacitance is:',['C/2','C','2C','4C'],0,'1/Ceq=1/C+1/C=2/C, so Ceq=C/2.'],
['An isolated neutral conductor contains a cavity with a point charge +q inside, without contact. The net charges on its inner and outer surfaces are:',['0 and 0','+q and −q','−q and +q','−q and 0'],2,'A Gaussian surface within the metal must enclose zero net charge, so the inner surface has −q. Neutrality then puts +q on the outer surface.'],
['A parallel-plate capacitor has area A and gap d. A dielectric κ fills half the plate area through the full gap; the rest is vacuum. Neglect fringing. Capacitance is:',['κε₀A/d','ε₀A(κ+1)/(2d)','2κε₀A/((κ+1)d)','ε₀A/(2κd)'],1,'The two side-by-side regions act in parallel, each of area A/2. Add κε₀A/(2d) and ε₀A/(2d).']
],
[
['Two resistors 6 Ω and 3 Ω are connected in parallel. Their equivalent resistance is:',['2 Ω','3 Ω','4.5 Ω','9 Ω'],0,'1/R=1/6+1/3=1/2, so R=2 Ω.'],
['An ideal battery ℰ with internal resistance r supplies a resistor R. The terminal voltage while current flows is:',['ℰ','ℰ+Ir','ℰ−Ir','Ir'],2,'The internal resistance drops Ir. Thus Vterminal=ℰ−Ir=IR.'],
['A battery of emf ℰ has fixed internal resistance r. Which load R receives maximum power?',['R=0','R=r','R=2r','R→∞'],1,'Pload=ℰ²R/(R+r)². Differentiation gives dP/dR=ℰ²(r−R)/(R+r)³, with maximum at R=r.']
],
[
['For a long straight wire, doubling current at fixed distance changes magnetic field magnitude from B to:',['B/2','B','2B','4B'],2,'B=μ₀I/(2πr), so B is proportional to I at fixed radius.'],
['A particle enters crossed uniform fields E and B perpendicular to each other and to its velocity. For zero net force, its speed must be:',['EB','B/E','E/B','√(E/B)'],2,'Electric and magnetic forces must oppose and have equal magnitudes: |q|E=|q|vB, giving v=E/B.'],
['A circular wire loop of radius R carries current I. Magnetic field magnitude at its center is:',['μ₀I/(2πR)','μ₀I/(2R)','μ₀I/R','μ₀IR/2'],1,'Biot–Savart: dB=μ₀I dℓ/(4πR²) at the center. Integrating around circumference 2πR gives μ₀I/(2R).']
],
[
['A stationary loop is in a constant, uniform magnetic field. Its area and orientation stay fixed. Its induced emf is:',['BA','B/A','Zero','Proportional to resistance'],2,'Flux does not change, so Faraday’s law gives ℰ=−dΦB/dt=0.'],
['Current in an inductor of inductance L increases at a constant rate a. The magnitude of its self-induced emf is:',['La','L/a','a/L','LI²/2'],0,'An ideal inductor has |ℰL|=L|dI/dt|=La.'],
['A conducting rod of mass m and length ℓ falls on frictionless vertical rails through perpendicular uniform B. Total resistance is R. Its terminal speed is:',['mgR/(B²ℓ²)','mg/(BℓR)','B²ℓ²/(mgR)','mgR/(Bℓ)'],0,'Motional emf gives I=Bℓv/R and upward magnetic drag F=IℓB=B²ℓ²v/R. At terminal speed F=mg.']
]
];
const extraFRQ=[
[
['A ball is thrown upward at speed 15 m/s from a height of 20 m. Ignore drag and use g=10 m/s².','Write its height and velocity as functions of time.','Find the impact time and impact speed.','y=20+15t−5t² and v=15−10t, taking up as positive.','Solve 20+15t−5t²=0: t=4 s. Velocity is −25 m/s, so impact speed is 25 m/s.'],
['A particle moves with x(t)=t³−6t²+9t in SI units for 0≤t≤4 s.','Find its velocity and all turning times.','Calculate displacement and total distance over this interval.','v=3t²−12t+9=3(t−1)(t−3), so turning times are 1 s and 3 s.','Positions at 0,1,3,4 s are 0,4,0,4 m. Displacement is 4 m; total distance is 4+4+4=12 m.'],
['A particle has a(t)=−βv(t), with β>0. Initially x=0 and v=v₀>0.','Derive v(t) and x(t).','Find the limiting displacement and the time to travel half of it.','dv/v=−βdt gives v=v₀e^(−βt). Integrating, x=(v₀/β)(1−e^(−βt)).','As t→∞, x→v₀/β. Halfway requires e^(−βt)=1/2, so t=(ln2)/β.']
],
[
['A 3 kg passenger package is on an elevator floor accelerating upward at 2 m/s². Use g=10 m/s².','Draw or describe its free-body diagram and calculate normal force.','Find normal force when the elevator instead accelerates downward at 2 m/s².','Weight 30 N downward and normal upward. N−30=3(2), so N=36 N.','N−30=3(−2) gives N=24 N. Direction of velocity alone does not determine normal force.'],
['Masses m and 2m are connected by a light string over an ideal massless pulley.','Derive their acceleration and string tension.','Calculate the speed after the heavier mass falls a distance h from rest.','2mg−T=2ma and T−mg=ma. Add: a=g/3; then T=4mg/3.','v²=2ah, giving v=√(2gh/3).'],
['A mass m moves along +x with v(0)=v₀ under F=−cv², c>0.','Derive v(t) using separation of variables.','Find displacement as a function of t and determine whether it approaches a finite limit.','m dv/v²=−c dt gives v=v₀/(1+cv₀t/m).','x=(m/c)ln(1+cv₀t/m). It grows without bound, although velocity approaches zero.']
],
[
['A spring of constant k=200 N/m is compressed by 0.20 m and launches a 1 kg block on a frictionless surface.','Calculate the stored spring energy.','Find the launch speed when the spring reaches its relaxed length.','U=½kx²=½(200)(0.20)²=4 J.','½mv²=4 J, so v=√8≈2.83 m/s.'],
['A motor pulls a mass m vertically upward at constant speed v through height h.','Find the motor force, work, and mechanical power.','If its efficiency is η, find the required electrical energy.','Constant speed implies F=mg. Work=mgh; mechanical power=mgv.','η=Emechanical/Eelectrical, so Eelectrical=mgh/η.'],
['A small block slides from rest into a frictionless vertical loop of radius R. It starts at height h above the bottom.','Derive the minimum h needed to maintain contact at the top.','For this minimum h, find the normal force at the bottom.','At the top, N=0 at threshold, giving vtop²=gR. Energy: mgh=2mgR+½mgR, so hmin=5R/2.','Energy at bottom gives vbottom²=2ghmin=5gR. N−mg=mvbottom²/R=5mg, so N=6mg.']
],
[
['A 0.20 kg ball moves at +10 m/s and rebounds at −5 m/s after a 0.10 s contact with a wall.','Find its momentum change and impulse.','Find the average force from the wall, neglecting other forces during contact.','Δp=0.20(−5−10)=−3 N·s. The impulse is −3 N·s.','Favg=Δp/Δt=−3/0.10=−30 N.'],
['An object initially at rest explodes into masses m and 3m on a frictionless surface. The smaller fragment moves at speed u.','Find the other fragment’s velocity relative to the smaller fragment’s direction.','Find the ratio of their kinetic energies and total kinetic energy.','0=mu+3mV gives V=−u/3.','Ksmall=mu²/2; Klarge=mu²/6, so the ratio is 3:1 and total K=2mu²/3.'],
['A mass m moving at speed u elastically collides head-on with a stationary mass M.','Derive the two final velocities from momentum and energy conservation.','Find the fraction of initial kinetic energy transferred to M and the value of M that maximizes it.','mu=mv+MV and u=V−v give v=(m−M)u/(m+M), V=2mu/(m+M).','Fraction=4mM/(m+M)². It is maximized at M=m, where the fraction is 1.']
],
[
['A rotor initially at rest has constant angular acceleration 2 rad/s² for 5 s.','Find its final angular velocity.','Find its angular displacement and number of revolutions.','ω=αt=10 rad/s.','Δθ=½αt²=25 rad; revolutions=25/(2π)≈3.98.'],
['A uniform rod of mass M and length L lies along the x-axis with its center at the origin.','Use an integral to find its moment of inertia about its center, perpendicular to the rod.','Use the parallel-axis theorem to find inertia about an end.','λ=M/L; Icm=∫₋ᴸ⁄₂ᴸ⁄₂ x²(M/L)dx=ML²/12.','Iend=Icm+M(L/2)²=ML²/3.'],
['A mass m hangs from a string around a solid disk pulley of mass M and radius R. The fixed axle is frictionless and the string does not slip.','Derive acceleration and tension.','Find the speed after the mass falls a distance h, and verify with energy.','mg−T=ma; TR=(MR²/2)(a/R). Thus a=mg/(m+M/2), T=Mg m/(2m+M).','v²=2mgh/(m+M/2). Energy gives mgh=½mv²+¼Mv², the same result.']
],
[
['A disk of inertia I=2 kg·m² slows from 6 rad/s to rest under a constant resisting torque of magnitude 3 N·m.','Find the time to stop.','Find the angular displacement and dissipated energy.','|α|=τ/I=1.5 rad/s². Stop time=6/1.5=4 s.','Angle=ωavg t=3(4)=12 rad. Energy dissipated=½Iω₀²=36 J=τΔθ.'],
['A satellite of mass m orbits a planet of mass M in a circle of radius r.','Derive orbital speed and period.','Find total mechanical energy and the minimum energy needed to escape to infinity.','GMm/r²=mv²/r, so v=√(GM/r) and T=2π√(r³/(GM)).','E=½mv²−GMm/r=−GMm/(2r). Escape at zero final speed needs an energy increase GMm/(2r).'],
['A solid disk moves on a rough horizontal floor initially with speed v₀ and no rotation. Its inertia is mR²/2 and kinetic friction is μmg.','Find v(t) and ω(t) while it slips.','Find the time, speed, and fraction of initial kinetic energy lost when rolling begins.','v=v₀−μgt; angular acceleration=μmgR/I=2μg/R, so ω=2μgt/R.','v=ωR gives t=v₀/(3μg) and v=2v₀/3. Final energy=(3/4)m(2v₀/3)²=mv₀²/3; compared with mv₀²/2, the lost fraction is 1/3.']
],
[
['An ideal oscillator has amplitude A=0.05 m, mass m=1 kg, and k=100 N/m.','Find angular frequency and total energy.','Find maximum speed and maximum acceleration.','ω=√(k/m)=10 rad/s; E=½kA²=0.125 J.','vmax=ωA=0.50 m/s; amax=ω²A=5 m/s².'],
['A pendulum of length ℓ swings with small amplitude in an elevator accelerating upward at a.','Derive its equation of motion in the elevator frame.','Find the period and explain its change relative to a stationary elevator.','The effective downward field is g+a. Tangential equation: mℓθ̈=−m(g+a)sinθ≈−m(g+a)θ.','T=2π√(ℓ/(g+a)), smaller than 2π√(ℓ/g), because the restoring acceleration is greater.'],
['A particle of mass m moves near the stable equilibrium at x=0 in U(x)=ax²+bx⁴, with a,b>0.','Find the exact force and the small-amplitude angular frequency.','For amplitude A, derive the maximum speed using energy, then give its small-A limit.','F=−2ax−4bx³. For small x, F≈−2ax so ω=√(2a/m).','At the center, ½mvmax²=aA²+bA⁴, so vmax=√[2(aA²+bA⁴)/m]. For small A, vmax≈A√(2a/m).']
],
[
['A cube of side a is in a uniform field E pointing along +x. No charge is inside it.','Find the flux through the two faces perpendicular to x.','Find total flux and explain why the field can be nonzero.','Right-face outward normal is +x, giving +Ea². Left-face outward normal is −x, giving −Ea².','Other faces have zero flux; total flux is zero. Gauss’s law constrains net flux, not the field at each point.'],
['Two charges +Q are fixed at (−a,0) and (a,0).','Derive the electric field on the y-axis at (0,y).','Find the leading approximation for |y|≫a and interpret it.','Horizontal components cancel. E_y=2kQy/(a²+y²)^(3/2), while Eₓ=0.','At large distance E_y≈2kQy/|y|³, the field of a single point charge 2Q at the origin.'],
['An infinite slab with uniform charge density ρ>0 extends from x=−a to x=a.','Derive Eₓ inside the slab using Gauss’s law.','Find Eₓ outside and check continuity at the surfaces.','Symmetry gives normal fields of opposite sign at ±x. 2EA=ρ(2xA)/ε₀ yields Eₓ=ρx/ε₀ for |x|≤a.','For x>a, Eₓ=ρa/ε₀; for x<−a, Eₓ=−ρa/ε₀. These match the inner field at x=±a.']
],
[
['A positive charge q moves slowly between points A and B with VA=20 V and VB=50 V.','Find the change in potential energy.','Find electric-field work and external work when kinetic energy is unchanged.','ΔU=q(VB−VA)=30q J when q is in coulombs.','Wfield=−30q J. Since ΔK=0, Wexternal=+30q J.'],
['A charge +Q is fixed at the origin. A particle of mass m and charge −q is released from rest at r=b and moves to r=a, where 0<a<b.','Use conservation of energy to derive its speed at a.','Explain the signs of the potential energy and the work done by the field.','U=−kQq/r. ½mv²=kQq(1/a−1/b), so v=√[(2kQq/m)(1/a−1/b)].','U decreases (becomes more negative) as separation shrinks. The field does positive work equal to the increase in kinetic energy.'],
['The electric potential in a plane is V(x,y)=a(x²−y²), a>0.','Find Eₓ and E_y, then show the net flux through a small square in the plane per unit perpendicular depth is zero.','Find the field-line equation in any quadrant away from the axes.','Eₓ=−2ax and E_y=2ay. Divergence ∂Eₓ/∂x+∂E_y/∂y=−2a+2a=0, so the net flux through a closed rectangular prism is zero.','dy/dx=E_y/Eₓ=−y/x. Integrating gives ln|y|=−ln|x|+constant, hence xy=constant.']
],
[
['Two capacitors C and 3C are placed in parallel across voltage V.','Find equivalent capacitance and charge on each capacitor.','Find the total stored energy.','Ceq=4C. Charges are CV and 3CV because voltage is shared.','Utotal=½CeqV²=2CV².'],
['A point charge +q is placed inside a cavity of an isolated neutral conductor, without contact.','Determine net induced charges on the cavity wall and outer surface.','Explain the field in the metal and whether the cavity-wall charge must be uniform.','The cavity wall carries −q and the outer surface +q. A Gaussian surface in the metal encloses zero net charge.','Field in the metal is zero in electrostatic equilibrium. The inner charge need not be uniform; it depends on cavity shape and charge location.'],
['A parallel-plate capacitor has area A and gap d. A dielectric κ fills half the gap thickness over the full area; the remaining half is vacuum. Neglect fringing.','Derive the equivalent capacitance.','For fixed charge Q, find fields in the dielectric and vacuum and verify the voltage.','The layers are in series: 1/C=(d/2)/(κε₀A)+(d/2)/(ε₀A), so C=2κε₀A/[d(κ+1)].','E_vac=Q/(ε₀A), E_diel=Q/(κε₀A). V=(d/2)(E_vac+E_diel)=Q/C.']
],
[
['A 6 Ω and a 3 Ω resistor are connected in parallel across an ideal 12 V battery.','Find the current in each branch.','Find equivalent resistance and total battery power.','I6=12/6=2 A; I3=12/3=4 A.','I_total=6 A; Req=12/6=2 Ω; P=VI=72 W.'],
['A capacitor initially charged to V₀ discharges through a resistor R.','Derive q(t) and the magnitude of current.','Find the time when half the initial energy remains.','R dq/dt+q/C=0. q=CV₀e^(−t/RC); |I|=(V₀/R)e^(−t/RC).','U=U₀e^(−2t/RC). Set U/U₀=1/2 to get t=(RC/2)ln2.'],
['A battery of emf ℰ and internal resistance r is connected to a variable load R.','Derive the load power as a function of R and find its maximum.','Find the efficiency of energy delivery to the load at the maximum-power setting.','I=ℰ/(r+R), P=ℰ²R/(r+R)². dP/dR=ℰ²(r−R)/(r+R)³, so R=r and Pmax=ℰ²/(4r).','Efficiency=Pload/(ℰI)=R/(r+R). At R=r it is 1/2; half the supplied power heats the internal resistance.']
],
[
['A straight segment of wire of length ℓ carries current I perpendicular to a uniform magnetic field B.','Find the magnetic force magnitude and describe its direction.','If current doubles and length halves, determine the new force.','F=IℓB, directed along ℓ⃗×B for conventional current.','Fnew=(2I)(ℓ/2)B=IℓB, unchanged.'],
['A charge q>0 enters a uniform B with velocity components v∥ parallel and v⊥ perpendicular to the field.','Find the helix radius and period.','Find the distance advanced along the field in one turn.','r=mv⊥/(qB); T=2πm/(qB), from circular motion in the perpendicular plane.','Pitch=v∥T=2πmv∥/(qB); the parallel velocity is constant.'],
['A circular wire loop of radius R carries current I.','Use Biot–Savart to derive the field at its center.','Derive the axial field at coordinate z using symmetry.','At the center, all dB align: B=(μ₀I/(4πR²))∮dℓ=μ₀I/(2R).','Transverse contributions cancel. The axial component integrates to B_z=μ₀IR²/[2(R²+z²)^(3/2)], directed by the right-hand rule.']
],
[
['A single-turn loop of area A has its plane perpendicular to B(t)=B₀+bt. Its resistance is R.','Find the magnitude of induced emf and current.','Find the energy dissipated over a time interval T.','|ℰ|=A|b| and |I|=A|b|/R.','P=I²R=A²b²/R, so dissipated energy is A²b²T/R.'],
['An inductor L initially carries current I₀ and then discharges through a resistor R in a closed loop.','Derive I(t).','Integrate resistor power to find the total heat dissipated.','L dI/dt+RI=0, so I=I₀e^(−Rt/L).','Heat=∫₀∞ RI₀²e^(−2Rt/L)dt=½LI₀², equal to the initial magnetic energy.'],
['A rod of mass m and length ℓ falls along frictionless conducting rails in perpendicular uniform B. The total resistance is R; inductance is negligible. It starts from rest.','Derive the equation of motion and solve for speed.','Find the time constant and terminal speed, and verify power balance at terminal speed.','m dv/dt=mg−(B²ℓ²/R)v. Thus v=[mgR/(B²ℓ²)](1−e^(−B²ℓ²t/(mR))).','τ=mR/(B²ℓ²), vterm=mgR/(B²ℓ²). At terminal speed mgvterm=I²R with I=Bℓvterm/R.']
]
];
extraMCQ.forEach((qs,i)=>qs.forEach((q,d)=>bank.push({id:`${i+1}-m-extra-${d}`,unit:i+1,type:'MCQ',level:d,prompt:q[0],options:q[1],answer:q[2],explanation:q[3]})));
extraFRQ.forEach((qs,i)=>qs.forEach((q,d)=>bank.push({id:`${i+1}-f-extra-${d}`,unit:i+1,type:'FRQ',level:d,prompt:q[0],parts:[q[1],q[2]],solutions:[q[3],q[4]]})));
