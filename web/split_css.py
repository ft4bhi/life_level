import sys

with open("app/home/page.tsx", "r") as f:
    lines = f.readlines()

# Extract CSS
# Line 623 is index 622, line 1635 is index 1634
css_lines = lines[623:1634]
with open("app/home/waypoint.css", "w") as f:
    f.writelines(css_lines)

# Create modified page.tsx
# In page.tsx, we need to add the import at the top
import_str = 'import "./waypoint.css";\n'
new_lines = lines[:2] + [import_str] + lines[2:622] + lines[1635:]

with open("app/home/page.tsx", "w") as f:
    f.writelines(new_lines)
