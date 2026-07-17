with open("app/home/page.tsx", "r") as f:
    text = f.read()

nav_start = text.find('      {/* NAV */}')
nav_end = text.find('      {/* HERO / TOP OF TRAIL */}')
if nav_start >= 0 and nav_end >= 0:
    text = text[:nav_start] + text[nav_end:]
    with open("app/home/page.tsx", "w") as f:
        f.write(text)

with open("app/home/useWaypointGsap.ts", "r") as f:
    gsap_text = f.read()

gsap_text = gsap_text.replace('.to("#topnav", { y: 0, opacity: 1, duration: 0.7 })', '.from("#topnav", { y: -100, opacity: 0, duration: 0.7 })')
gsap_text = gsap_text.replace('gsap.set(["#topnav", "#eyebrow"], { opacity: 1, y: 0 });', 'gsap.set(["#eyebrow"], { opacity: 1, y: 0 });')

nav_interact_start = gsap_text.find('        /* ============= NAV INTERACTIONS ============= */')
nav_interact_end = gsap_text.find('        /* ============= MODAL ============= */')
if nav_interact_start >= 0 and nav_interact_end >= 0:
    gsap_text = gsap_text[:nav_interact_start] + gsap_text[nav_interact_end:]

cleanup_start = gsap_text.find('          settingsBtn.removeEventListener("click", onSettingsBtnClick);')
cleanup_end = gsap_text.find('          overlay.removeEventListener("click", onOverlayClick);')
if cleanup_start >= 0 and cleanup_end >= 0:
    gsap_text = gsap_text[:cleanup_start] + gsap_text[cleanup_end:]

with open("app/home/useWaypointGsap.ts", "w") as f:
    f.write(gsap_text)
