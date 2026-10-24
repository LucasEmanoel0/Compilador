from pathlib import Path
import subprocess
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
import difflib

BASE = 'https://raw.githubusercontent.com/nand2tetris/projects/main/projects/10'
CASOS = {
    'Square': ['Main', 'Square', 'SquareGame'],
    'ArrayTest': ['Main'],
    'ExpressionLessSquare': ['Main', 'Square', 'SquareGame'],
}

def normalizar(e):
    return (e.tag, (e.text or '').strip(), tuple(normalizar(x) for x in e))

raiz = Path(__file__).resolve().parent
ok = falhas = indisponiveis = 0
for pasta, nomes in CASOS.items():
    for nome in nomes:
        caso = f'{pasta}/{nome}'
        diretorio = raiz / 'referencias' / pasta
        diretorio.mkdir(parents=True, exist_ok=True)
        entrada, oficial, gerado = (diretorio / f'{nome}{s}.xml' for s in ('T', '', '_gerado'))
        try:
            for destino in (entrada, oficial):
                if not destino.exists():
                    url = f'{BASE}/{pasta}/{destino.name}'
                    urllib.request.urlretrieve(url, destino)
        except (urllib.error.HTTPError, urllib.error.URLError, OSError) as ex:
            print(f'INDISPONÍVEL: {caso} — não foi possível obter arquivos: {ex}')
            indisponiveis += 1
            continue
        resultado = subprocess.run(['node', str(raiz / 'comparar_oficial.js'), str(entrada), str(gerado)], capture_output=True, text=True, cwd=raiz)
        if resultado.returncode != 0:
            print(f'FALHOU: {caso} — {resultado.stderr.strip() or resultado.stdout.strip()}')
            falhas += 1
            continue
        try:
            ref = normalizar(ET.parse(oficial).getroot())
            obt = normalizar(ET.parse(gerado).getroot())
            if ref == obt:
                print(f'APROVADO: {caso}.xml')
                ok += 1
            else:
                print(f'DIFERENÇA: {caso}.xml')
                diff = difflib.unified_diff(oficial.read_text().splitlines(), gerado.read_text().splitlines(), fromfile='oficial', tofile='gerado', lineterm='')
                for linha in list(diff)[:25]:
                    print(' ', linha)
                falhas += 1
        except (ET.ParseError, OSError) as ex:
            print(f'ERRO XML: {caso}: {ex}')
            falhas += 1
print(f'\nResumo: {ok} aprovados, {falhas} falhas/diferenças, {indisponiveis} indisponíveis')
if falhas or indisponiveis:
    raise SystemExit(1)
