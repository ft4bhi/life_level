import sys

with open("app/home/page.tsx", "r") as f:
    lines = f.readlines()

# find useEffect
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "const initialized = useRef(false);" in line:
        start_idx = i
    if "}, []);" in line and start_idx != -1:
        end_idx = i
        break

if start_idx == -1 or end_idx == -1:
    print("Could not find useEffect bounds")
    sys.exit(1)

hook_lines = lines[start_idx:end_idx+1]

with open("app/home/useWaypointGsap.ts", "w") as f:
    f.write('import { useEffect, useRef } from "react";\n')
    f.write('import { ZONES, NODES } from "./waypointData";\n\n')
    f.write('export function useWaypointGsap() {\n')
    for line in hook_lines:
        f.write(line)
    f.write('}\n')

new_page_lines = []
for i in range(start_idx):
    if "import { useEffect, useRef } from \"react\";" in lines[i]:
        continue
    if "import { ZONES, NODES } from \"./waypointData\";" in lines[i]:
        continue
    new_page_lines.append(lines[i])

# add import
new_page_lines.insert(2, 'import { useWaypointGsap } from "./useWaypointGsap";\n')

new_page_lines.append('  useWaypointGsap();\n')

for i in range(end_idx+1, len(lines)):
    new_page_lines.append(lines[i])

with open("app/home/page.tsx", "w") as f:
    f.writelines(new_page_lines)
