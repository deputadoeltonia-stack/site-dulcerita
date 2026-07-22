"""Gera og-image, favicons e apple-touch-icon do site da Dulce Rita.
Usa os tokens do site: vinho #6d1f3a, vinho-escuro #521228, rosa #c9557c, ambar #e8a13d.
"""
from PIL import Image, ImageDraw, ImageFont

BASE = "/private/tmp/claude-501/-Users-aquivaleredacao/0c041597-9469-42f4-972f-097f892455f0/scratchpad"
OUT = "/Users/aquivaleredacao/Projetos/site-dulcerita/public/assets"

VINHO = (109, 31, 58)
VINHO_TOPO = (122, 35, 66)
VINHO_ESC = (82, 18, 40)
ROSA = (201, 85, 124)
AMBAR = (232, 161, 61)
CLARO = (253, 249, 247)

gloock = lambda s: ImageFont.truetype(f"{BASE}/gloock.ttf", s)
archivo_b = lambda s: ImageFont.truetype(f"{BASE}/archivo-b.ttf", s)


def fundo(w, h):
    """Gradiente vertical vinho + halo radial rosa, igual ao hero."""
    grad = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(h - 1, 1)
        if t < 0.38:
            k = t / 0.38
            c = tuple(round(VINHO_TOPO[i] + (VINHO[i] - VINHO_TOPO[i]) * k) for i in range(3))
        else:
            k = (t - 0.38) / 0.62
            c = tuple(round(VINHO[i] + (VINHO_ESC[i] - VINHO[i]) * k) for i in range(3))
        grad.putpixel((0, y), c)
    img = grad.resize((w, h))

    # halo radial rosa em 72% x 42%
    halo = Image.new("L", (w, h), 0)
    hd = ImageDraw.Draw(halo)
    cx, cy, r = int(w * 0.72), int(h * 0.42), int(w * 0.42)
    passos = 60
    for i in range(passos, 0, -1):
        rr = r * i / passos
        hd.ellipse([cx - rr, cy - rr * 0.85, cx + rr, cy + rr * 0.85],
                   fill=int(110 * (1 - i / passos) ** 1.6))
    img.paste(Image.new("RGB", (w, h), ROSA), (0, 0), halo)
    return img


def og():
    W, H = 1200, 630
    img = fundo(W, H)

    # retrato sangrando à direita, alinhado pela base
    foto = Image.open(f"{OUT}/dulce-rita.webp").convert("RGBA")
    alt = int(H * 0.98)
    foto = foto.resize((round(foto.width * alt / foto.height), alt), Image.LANCZOS)
    img.paste(foto, (W - foto.width - 40, H - foto.height), foto)

    # vinheta inferior pra assentar a foto
    vin = Image.new("L", (W, H), 0)
    vd = ImageDraw.Draw(vin)
    for y in range(int(H * 0.72), H):
        k = (y - H * 0.72) / (H * 0.28)
        vd.line([(0, y), (W, y)], fill=int(120 * k))
    img.paste(Image.new("RGB", (W, H), VINHO_ESC), (0, 0), vin)

    d = ImageDraw.Draw(img)
    x = 68

    # eyebrow tracked manualmente (PIL não tem letter-spacing)
    f_eb = archivo_b(20)
    ex, ey = x, 150
    for ch in "VEREADORA · SÃO JOSÉ DOS CAMPOS":
        d.text((ex, ey), ch, font=f_eb, fill=AMBAR)
        ex += d.textlength(ch, font=f_eb) + 3.2

    d.text((x, 196), "Dulce", font=gloock(132), fill=CLARO)
    d.text((x, 330), "Rita", font=gloock(132), fill=CLARO)

    # slogan com a barra âmbar (assinatura da marca)
    f_sl = gloock(52)
    sy = 486
    larg = d.textlength("Cuidar de perto.", font=f_sl)
    d.rectangle([x - 8, sy + 34, x + larg + 8, sy + 60], fill=AMBAR)
    d.text((x, sy), "Cuidar de perto.", font=f_sl, fill=CLARO)

    img.save(f"{OUT}/og-image.jpg", quality=88, optimize=True)
    print("og-image.jpg", img.size)


def icone(tam, raio_frac=0.22):
    """Quadrado arredondado vinho com monograma DR claro (mesmo tratamento
    do wordmark no header). Claro em vez de âmbar: a 32px o âmbar sobre
    vinho não tem contraste suficiente."""
    ss = 8  # supersample pra borda limpa
    s = tam * ss
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, s, s], radius=int(s * raio_frac), fill=VINHO + (255,))

    f = gloock(int(s * 0.54))
    txt = "DR"
    caixa = d.textbbox((0, 0), txt, font=f)
    d.text(((s - (caixa[2] - caixa[0])) / 2 - caixa[0],
            (s - (caixa[3] - caixa[1])) / 2 - caixa[1]), txt, font=f, fill=CLARO)
    return img.resize((tam, tam), Image.LANCZOS)


if __name__ == "__main__":
    og()
    icone(32).save(f"{OUT}/favicon-32.png")
    icone(180).save(f"{OUT}/apple-touch-icon.png")
    print("icones ok")
