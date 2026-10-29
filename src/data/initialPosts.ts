import { BlogPost } from '../types';

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'gta-6-vice-city-novosti-datum-izida-analiza',
    title: 'Grand Theft Auto VI: Vse podrobnosti o vrnitvi v Vice City in 75+ urah kampanje',
    summary: 'Poglobljen pregled najbolj pričakovane videoigre desetletja: nov grafični pogon, prepleteni zgodbi dveh protagonistov in revolucionarna umetna inteligenca prebivalcev Vice Cityja.',
    content: `## Vrnitev v neonsko obsijani Vice City

Rockstar Games z novim poglavjem franšize **Grand Theft Auto VI** znova postavlja mejnike interaktivne zabave. Dogajanje je postavljeno v zvezno državo Leonida, sodobno reinterpretacijo Floride, z osrednjim mestnim jedrom Vice Cityja. Za razliko od preteklih iger je celoten zemljevid tokrat dinamičen, z obsežnimi močvirji Everglades, obalnimi avenijami in živahnim mestnim vrvežem.

### Ključne novosti v igralni mehaniki:
- **Dva osrednja protagonista**: Zgodba spremlja par v slogu Bonnie in Clyde (Lucia in Jason), med katerima lahko igralec taktično preklaplja med misijami in v odprtem svetu.
- **75+ ur glavne zgodbe**: Po zanesljivih podatkih glavna narativna linija obsega več kot 75 ur igranja, ob tem pa ponuja še na desetine stranskih aktivnosti, ropov in preiskav.
- **Fizika in animacija nove generacije**: Vsak prebivalec mesta ima svoj dnevni ritem, reakcijo na vreme, promet in družbena omrežja.

> *"GTA VI ni le še ena igra z odprtim svetom; je tehnološki skok, ki bo definiral naslednje desetletje gaming industrije."*

### Tehnične zahteve in optimizacija
Igra je primarno optimizirana za konzoli PlayStation 5 in Xbox Series X/S, kjer cilja na stabilnih 60 sličic na sekundo s tehnologijo ray-tracing globalne osvetlitve. PC različica bo predvidoma sledila z dodatnimi funkcijami za ultra-široke zaslone in neomejeno ločljivost.

Na WebKatu bomo podrobno spremljali vsako uradno napoved in analizo zmogljivosti ob izidu.`,
    category: 'gaming',
    categoryLabel: 'Gaming Novice',
    readTime: '5 min branja',
    publishedAt: '28. oktober 2026',
    author: 'Žiga Srdič',
    authorRole: 'WebKat Glavni Urednik & Razvijalec',
    tags: ['GTA 6', 'Rockstar Games', 'Vice City', 'PlayStation 5', 'Gaming Novice'],
    likes: 142,
    views: 1890,
    featured: true,
    coverTheme: 'vice',
    comments: [
      {
        id: 'c1',
        author: 'Luka M.',
        avatarSeed: 'luka',
        content: 'Končno konkreten pregled v slovenščini! Zelo me zanima, kako bo delovala fizika vode v močvirjih.',
        createdAt: 'Pred 2 urama',
      },
      {
        id: 'c2',
        author: 'Miha Gaming',
        avatarSeed: 'miha',
        content: 'Odlično napisano. Upam samo, da PC verzija ne bo zamujala preveč mesecev.',
        createdAt: 'Pred 5 urami',
      },
    ],
  },
  {
    id: 'post-2',
    slug: 'ea-sports-fc-26-real-player-motion-novosti',
    title: 'EA Sports FC 26: Nova era z mehaniko Real Player Motion+ in prenovljeno kariero',
    summary: 'Virtualni nogomet prehaja v novo fazo. Preverite, kaj prinaša nadgrajena mehanika gibanja igralcev, nov sistem taktičnih nalog ter prenovljen način kariere.',
    content: `## Real Player Motion+ in taktična globina

Elektronska umetnost (EA Sports) z izdajo **FC 26** nagovarja igralce, ki so si dolgo želeli bolj avtentičnega ritma nogometne igre. Namesto zgolj arkadnih preigravanj je v ospredju mehanika **Real Player Motion+**, ki upošteva telesno težo, vztrajnost in natančnost stika s travo.

### Glavni stebri posodobitve:
1. **Nove taktične vloge (Player Roles)**: Igralci se sedaj inteligentno odzivajo na gibanje soigralcev brez žoge. Vmesni prostori niso več statični.
2. **Karierni način z dinamičnimi novicami**: Vodenje kluba zdaj vključuje simulacijo tiskovnih konferenc, psihološko stanje ekipe in mladinske akademije po meri.
3. **Optimizacija mrežne kode (Netcode)**: Zmanjšan zamik pri prenosu ukazov (input lag) v Ultimate Team tekmovanjih.

Povezava med pravo športno dinamiko in digitalnim programiranjem je tukaj dosegla izjemno raven.`,
    category: 'gaming',
    categoryLabel: 'Gaming Novice',
    readTime: '4 min branja',
    publishedAt: '26. oktober 2026',
    author: 'Žiga Srdič',
    authorRole: 'WebKat Glavni Urednik & Razvijalec',
    tags: ['FC 26', 'EA Sports', 'Ultimate Team', 'Simulacija', 'eSports'],
    likes: 89,
    views: 1140,
    coverTheme: 'speed',
    comments: [],
  },
  {
    id: 'post-3',
    slug: 'core-web-vitals-hitrost-spletnih-strani-seo-2026',
    title: 'Zakaj so hitre spletne strani (Core Web Vitals) ključne za vaš uspeh v letu 2026',
    summary: 'Kako čas nalaganja pod 1 sekundo neposredno vpliva na višje uvrstitve na Googlu, večje število povpraševanj in boljšo uporabniško izkušnjo.',
    content: `## Hitrost ni več luksuz, ampak nuja

Vsaka sekunda zamika pri nalaganju spletne strani pomeni do 20 % manj konverzij. Iskalnik Google pri uvrščanju na prvo stran že leta daje prednost metrikam **Core Web Vitals** (LCP, INP, CLS).

### Tri ključne metrike za leto 2026:
- **LCP (Largest Contentful Paint)**: Čas, v katerem se prikaže glavni vsebinski blok. Cilj je pod 1.5 sekunde.
- **INP (Interaction to Next Paint)**: Kako hitro stran reagira na klik ali vnos uporabnika. Ne sme presegati 150 milisekund.
- **CLS (Cumulative Layout Shift)**: Preprečevanje poskakovanja elementov med nalaganjem slik ali oglasov.

### Zakaj na WebKatu prisegamo na moderno arhitekturo?
Klasične spletne strani, prenatrpane s 40 različnimi vtičniki, pogosto potrebujejo od 5 do 8 sekund za zagon. Naša rešitev temelji na čisti kodi (React, Tailwind CSS, napredno predpomnjenje in stiskanje slik), kar omogoča doseganje rezultata **100/100 na Google PageSpeed Insights**.

> *"Ko spletna stran deluje bliskovito hitro, uporabnik ostane dlje, Google pa vas nagradi z najvišjimi pozicijami."*`,
    category: 'webdev',
    categoryLabel: 'Spletni Razvoj',
    readTime: '6 min branja',
    publishedAt: '24. oktober 2026',
    author: 'Žiga Srdič',
    authorRole: 'WebKat Glavni Urednik & Razvijalec',
    tags: ['Core Web Vitals', 'SEO', 'Hitrost Stranic', 'Google Rank', 'Spletni Razvoj'],
    likes: 112,
    views: 1420,
    featured: true,
    coverTheme: 'speed',
    comments: [],
  },
  {
    id: 'post-4',
    slug: 'battlefield-6-pax-armata-kampanja-destrukcija',
    title: 'Battlefield 6: Prvi napovednik razkriva grožnjo korporacije Pax Armata',
    summary: 'Legendarna franšiza se vrača k surovemu, taktičnemu vojskovanju. Uničljivost okolja naslednje generacije in osredotočenost na 64-igralske spopade.',
    content: `## Vrnitev k taktičnemu bistvu Battlefielda

Po napovedih razvijalcev se **Battlefield 6** vrača k svojim koreninam: uničljiva bojišča, realističen zvok in poudarek na sodelovanju v 4-članski ekipi (squad).

### Zgodba in nasprotnik
V osrčju enoigralske kampanje je fiktivna globalna kriza, v kateri glavno vlogo igra zasebna vojaška korporacija **Pax Armata**. Za razliko od prejšnjega futurizma je dogajanje postavljeno v bližnjo prihodnost z realistično vojaško opremo, droni in naprednim elektronskim bojevanjem.

### Tehnični poudarki:
- **Destruction 2.0**: Stavbe se ne sesujejo po vnaprej posneti animaciji, ampak po fizikalnem izračunu udarcev granat in vozil.
- **Optimizacija za tekmovalno igranje**: Strogi strežniški tick-rate (60Hz+) za zanesljivo registracijo zadetkov.`,
    category: 'gaming',
    categoryLabel: 'Gaming Novice',
    readTime: '4 min branja',
    publishedAt: '22. oktober 2026',
    author: 'Žiga Srdič',
    authorRole: 'WebKat Glavni Urednik & Razvijalec',
    tags: ['Battlefield 6', 'FPS', 'Pax Armata', 'EA', 'Multiplayer'],
    likes: 77,
    views: 980,
    coverTheme: 'tactical',
    comments: [],
  },
  {
    id: 'post-5',
    slug: 'lokalni-seo-vodic-za-slovenska-podjetja-2026',
    title: 'Lokalni SEO za slovenska podjetja: Kako zmagati v lokalnem iskanju',
    summary: 'Praktični nasveti za mikro in mala podjetja v Sloveniji: Google profil podjetja, lokalne povratne povezave in strukturirani podatki Schema.org.',
    content: `## Zakaj je lokalni SEO vaša največja prednost?

Ko stranka v Velenju, Celju ali Ljubljani išče *"izdelava spletnih strani"* ali *"servis računalnikov"*, Google najprej prikaže lokalni zemljevid in relevantna lokalna podjetja.

### Ključni koraki za uspeh:
1. **Pravilen vnos podatkov NAP (Name, Address, Phone)**: Ime, naslov in telefonska številka morajo biti na spletni strani in v vseh imenikih zapisani povsem identično.
2. **Schema.org strukturirani podatki**: Iskalnikom natančno sporočite svojo lokacijo, delovni čas, storitve in geografske koordinate s kodo JSON-LD.
3. **Zbiranje pristnih ocen zadovoljnih strank**: Reden dotok mnenj neposredno vpliva na uvrstitev med prve 3 rezultate na zemljevidu (Local Pack).

Pri WebKatu v vsako izdelano spletno stran že v osnovi vgradimo celostno shemo lokalnega SEO.`,
    category: 'seo',
    categoryLabel: 'SEO & Marketing',
    readTime: '5 min branja',
    publishedAt: '19. oktober 2026',
    author: 'Žiga Srdič',
    authorRole: 'WebKat Glavni Urednik & Razvijalec',
    tags: ['Lokalni SEO', 'Google Profil Podjetja', 'Optimizacija', 'Slovenski Trg'],
    likes: 64,
    views: 870,
    coverTheme: 'code',
    comments: [],
  },
  {
    id: 'post-6',
    slug: 'metal-gear-solid-delta-snake-eater-remake-analiza',
    title: 'Metal Gear Solid Delta: Snake Eater – Kako Unreal Engine 5 obuja legendarno izkušnjo',
    summary: 'Kultna taktična vohunska igra se vrača z osupljivimi podrobnostmi blata, poškodb oblačil ter zvočno kuliso džungle v realnem času.',
    content: `## Ohranitev kultnega igranja ob sodobni grafični preobleki

Konami se je pri predelavi **Metal Gear Solid Delta: Snake Eater** odločil za spoštljiv pristop: izvirni zvočni posnetki in glasovna igra ostajata nespremenjena, medtem ko je vizualna plast v celoti zgrajena na novo v pogonu **Unreal Engine 5**.

### Podrobnosti, ki navdušujejo:
- **Dinamika poškodb na telesu**: Vsaka praska, ugriz kače ali prestreljeno oblačilo ostane vidno skozi celotno kampanjo.
- **Izboljšana kamuflaža**: Sistem za kamuflažo sedaj upošteva vlažnost, blato in senco vegetacije.
- **Sodobno ali klasično upravljanje**: Igralec lahko izbira med modernim tretjeosebnim pogledom čez ramo ali klasičnim zornim kotom kamere izvirnika.`,
    category: 'gaming',
    categoryLabel: 'Gaming Novice',
    readTime: '4 min branja',
    publishedAt: '15. oktober 2026',
    author: 'Žiga Srdič',
    authorRole: 'WebKat Glavni Urednik & Razvijalec',
    tags: ['MGS Delta', 'Snake Eater', 'Konami', 'Unreal Engine 5', 'Stealth'],
    likes: 95,
    views: 1210,
    coverTheme: 'tactical',
    comments: [],
  },
];

export const SERVICE_PACKAGES = [
  {
    id: 'srv-1',
    index: '01',
    title: 'Predstavitvena Spletna Stran',
    tagline: 'Za samostojne podjetnike in manjša podjetja',
    description: 'Bliskovito hitra, sodobna enostranska ali večstranska predstavitvena stran, prilagojena vsem napravam in optimizirana za iskalnike.',
    features: [
      '100/100 rezultat na Google PageSpeed',
      'Unikatno grafično oblikovanje po meri',
      'Popolna mobilna odzivnost & varnostni SSL certifikat',
      'Osnovna SEO optimizacija z lokalnim vpisom',
      'Povezava s kontaktnim obrazcem & Google zemljevidi',
    ],
    idealFor: 'Obrtniki, svetovalci, lokalne storitve',
    timeframe: '5–10 delovnih dni',
    startingPrice: 'od 490 €',
    badge: 'Najbolj Priljubljeno',
  },
  {
    id: 'srv-2',
    index: '02',
    title: 'Spletna Trgovina (E-Commerce)',
    tagline: 'Zanesljiva prodaja vaših izdelkov na spletu',
    description: 'Sodobna spletna trgovina z enostavnim urejanjem artiklov, integriranimi plačilnimi metodami (kartice, Flik, po povzetju) in avtomatiziranimi računi.',
    features: [
      'Hitra nakupovalna košarica brez zapletov',
      'Povezava s plačilnimi sistemi (Stripe, PayPal, Flik)',
      'Upravljanje zalog, popustov in kuponov',
      'Avtomatska obvestila kupcem & sledenje pošiljk',
      'Napredna SEO optimizacija za kategorije in izdelke',
    ],
    idealFor: 'Trgovci, blagovne znamke, digitalni produkti',
    timeframe: '2–3 tedne',
    startingPrice: 'od 990 €',
  },
  {
    id: 'srv-3',
    index: '03',
    title: 'Spletna Aplikacija & Gaming Portali',
    tagline: 'Rešitve po meri z dinamičnimi funkcijami',
    description: 'Razvoj specializiranih spletnih platform, portalov za gaming skupnosti, forumov, vgrajenih blogov in naprednih interaktivnih orodij.',
    features: [
      'Arhitektura z React, TypeScript in modernimi API-ji',
      'Vgrajen sistem za upravljanje vsebin (CMS)',
      'Uporabniški profili, avtentikacija in diskusije',
      'Integracija z zunanjimi bazami in storitvami',
      'Maksimalna varnost in možnost hitre razširljivosti',
    ],
    idealFor: 'Gaming skupnosti, portali z novicami, startupi',
    timeframe: '3–5 tednov',
    startingPrice: 'od 1.490 €',
  },
  {
    id: 'srv-4',
    index: '04',
    title: 'SEO Optimizacija & Vzdrževanje',
    tagline: 'Skrb za varnost, hitrost in visoke uvrstitve',
    description: 'Mesečno vzdrževanje vaše spletne strani, redne varnostne kopije, nadgradnje ter stalno spremljanje in izboljševanje pozicij na Googlu.',
    features: [
      'Redne varnostne kopije in tehnični pregledi',
      'Mesečno poročilo o obisku in uvrstitvah na Googlu',
      'Pisanje in optimizacija novih člankov / bloga',
      'Prednostna tehnična podpora preko e-pošte in telefona',
      'Brezplačne manjše posodobitve vsebin',
    ],
    idealFor: 'Vsa podjetja, ki želijo brezskrbno delovanje',
    timeframe: 'Mesečni paket',
    startingPrice: 'od 79 € / mesec',
  },
];
