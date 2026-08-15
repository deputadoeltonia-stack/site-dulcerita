"""Gera og-image, favicon e apple-touch-icon do site da Dulce Rita.
Identidade oficial (docs/DULCE ID.pdf): navy #094b68, navy-claro #0a6089,
mint #5ac2ad, lime #add136, off-white #f0f4f2. Tipografia e marca vêm dos
SVGs vetoriais extraídos do próprio ID (public/assets/marca), rasterizados
via PyMuPDF — nada de recompor o logotipo com fonte aproximada.

Rodar com o venv que tem PyMuPDF+Pillow (o pdfvenv do scratchpad serve).
"""
import fitz
from PIL import Image, ImageDraw

RAIZ = "/Users/aquivaleredacao/Projetos/site-dulcerita"
MARCA = f"{RAIZ}/public/assets/marca"
OUT = f"{RAIZ}/public/assets"

NAVY = (9, 75, 104)
NAVY_CLARO = (10, 96, 137)
NAVY_FUNDO = (8, 58, 82)
MINT = (90, 194, 173)
LIME = (173, 209, 54)
OFF = (240, 244, 242)


def svg_png(caminho, cor=None, largura=800):
    """Rasteriza um SVG da marca em RGBA; cor substitui currentColor."""
    s = open(caminho).read()
    if cor:
        s = s.replace("currentColor", "#%02x%02x%02x" % cor)
    doc = fitz.open(stream=s.encode(), filetype="svg")
    pg = doc[0]
    zoom = largura / pg.rect.width
    pix = pg.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=True)
    return Image.frombytes("RGBA", (pix.width, pix.height), pix.samples)


def fundo(w, h):
    """Gradiente navy + banda do padrão de pessoinhas na base."""
    grad = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(h - 1, 1)
        c = tuple(round(NAVY[i] + (NAVY_FUNDO[i] - NAVY[i]) * t) for i in range(3))
        grad.putpixel((0, y), c)
    img = grad.resize((w, h)).convert("RGBA")

    tile = svg_png(f"{MARCA}/padrao-navy.svg", largura=220)
    faixa_topo = int(h * 0.55)
    y = faixa_topo
    while y < h:
        x = 0
        while x < w:
            # esmaece conforme sobe (dissolve, como no site)
            k = min(1.0, (y - faixa_topo) / (h - faixa_topo) + 0.25)
            t2 = tile.copy()
            alfa = t2.getchannel("A").point(lambda a: int(a * 0.55 * k))
            t2.putalpha(alfa)
            img.alpha_composite(t2, (x, y))
            x += tile.width
        y += tile.height
    return img


def og():
    W, H = 1200, 630
    img = fundo(W, H)

    # retrato meio corpo sangrando à direita
    foto = Image.open(f"{OUT}/dulce-rita.webp").convert("RGBA")
    alt = int(H * 1.5)   # 1.5x da altura: corta na cintura (meio corpo)
    foto = foto.resize((round(foto.width * alt / foto.height), alt), Image.LANCZOS)
    img.alpha_composite(foto.crop((0, 0, foto.width, H)), (W - foto.width + 10, 0))

    # lockup à esquerda: // DEPUTADA ESTADUAL + logo + 44012 + pessoinhas
    x = 64
    d = ImageDraw.Draw(img)
    # barras // em lime
    d.polygon([(x + 8, 168), (x + 22, 168), (x + 10, 206), (x - 4, 206)], fill=LIME)
    d.polygon([(x + 30, 168), (x + 38, 168), (x + 26, 206), (x + 18, 206)], fill=LIME)

    logo = svg_png(f"{MARCA}/logo-dulce.svg", cor=OFF, largura=560)
    img.alpha_composite(logo, (x, 236))

    numero = svg_png(f"{MARCA}/digitos-44012.svg", cor=(255, 255, 255), largura=430)
    img.alpha_composite(numero, (x, 340))

    trio = svg_png(f"{MARCA}/pessoinhas-trio.svg", largura=110)
    img.alpha_composite(trio, (x + 444, 352))

    # frase de apoio
    # (texto raster simples: Avenir do sistema não é garantido — usa o
    #  Geometos extraído se precisar de texto; aqui a marca já fala)

    img.convert("RGB").save(f"{OUT}/og-image.jpg", quality=88, optimize=True)
    print("og-image.jpg", img.size)


def icone(tam, raio_frac=0.22):
    """Quadrado arredondado navy com a pessoinha mint (símbolo da marca)."""
    ss = 8
    s = tam * ss
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, s, s], radius=int(s * raio_frac), fill=NAVY + (255,))
    fig = svg_png(f"{MARCA}/pessoinha.svg", cor=MINT, largura=int(s * 0.58))
    img.alpha_composite(fig, ((s - fig.width) // 2, (s - fig.height) // 2))
    return img.resize((tam, tam), Image.LANCZOS)


if __name__ == "__main__":
    og()
    icone(32).save(f"{OUT}/favicon-32.png")
    icone(180).save(f"{OUT}/apple-touch-icon.png")
    print("icones ok")
