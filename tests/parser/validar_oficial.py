import subprocess
import urllib.request
from pathlib import Path
import xml.etree.ElementTree as ET

base = 'https://raw.githubusercontent.com/nand2tetris/projects/main/projects/10/Square/'
for name in ('MainT.xml', 'Main.xml'):
    urllib.request.urlretrieve(base + name, name)
    print('Obtido do repositório oficial:', name)

subprocess.run(['node', 'comparar_oficial.js', 'MainT.xml', 'Main_gerado.xml'], check=True)

def normalizar(element):
    return element.tag, (element.text or '').strip(), tuple(normalizar(child) for child in element)

referencia = normalizar(ET.parse('Main.xml').getroot())
resultado = normalizar(ET.parse('Main_gerado.xml').getroot())
if referencia == resultado:
    print('APROVADO: Square/Main.xml idêntico à referência oficial!')
else:
    print('DIFERENÇA: saída não corresponde à referência oficial')
    import difflib
    ref = Path('Main.xml').read_text().splitlines()
    out = Path('Main_gerado.xml').read_text().splitlines()
    print('\n'.join(list(difflib.unified_diff(ref,out,fromfile='oficial',tofile='gerado'))[:65]))
    raise SystemExit(1)
