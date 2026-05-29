/**
 * 한↔영 사전 + 변환기.
 * slunch-admin.html line 4479-4567 그대로 포팅.
 */

export const KO_EN: Record<string, string> = {
  // foods & ingredients
  '김치':'kimchi','볶음김치':'stir-fried kimchi','볶음밥':'fried rice','배추':'napa cabbage',
  '고춧가루':'red pepper powder (gochugaru)','대파':'green onion','마늘':'garlic','생강':'ginger',
  '참기름':'sesame oil','설탕':'sugar','소금':'salt','밥':'cooked rice','두부':'tofu',
  '깨':'sesame seeds','김':'seaweed (gim)','참깨':'sesame seeds','고추':'red chili pepper',
  '감태':'gamtae kelp','시금치':'spinach','뇨끼':'gnocchi','펜네':'penne','리조또':'risotto',
  '매생이':'maesaengi seaweed','트러플':'truffle','블루베리':'blueberry','복숭아':'peach',
  '타르트':'tart','케이크':'cake','피자':'pizza','주먹밥':'rice ball','칼국수':'kalguksu noodles',
  '밀가루':'wheat flour','전분':'starch','감자':'potato','올리브오일':'olive oil',
  '소시지':'sausage','페퍼로니':'pepperoni','치즈':'cheese','버터':'butter',
  '드레싱':'dressing','소스':'sauce','비건':'vegan','식물성':'plant-based',
  '단호박':'kabocha pumpkin','초코':'chocolate','피넛버터':'peanut butter',
  '랜치':'ranch','레몬':'lemon','발사믹':'balsamic','분짜':'bun cha',
  // appearance
  '젊은':'young','한국':'Korean','여성':'woman','남성':'man','주근깨':'freckles',
  '옅은':'light','앞머리':'bangs','일자':'blunt','땋은머리':'braids','쌍둥이':'twin',
  '낮은':'low','오버사이즈':'oversized','검정':'black','셔츠':'shirt','원피스':'dress',
  '짧은':'short','내추럴':'natural','젤':'gel','네일':'nails',
  // styling
  '흰':'white','세라믹':'ceramic','볼':'bowl','타원':'oval','접시':'plate',
  '숟가락':'spoon','젓가락':'chopsticks','포크':'fork','나무':'wooden',
  '금지':'excluded','만':'only','약간':'minimal',
  '잘게 썬':'finely shredded',
  // bg
  '단색':'solid','노랑':'yellow','노란':'yellow','주황':'orange','재활용':'recycled',
  '플라스틱':'plastic','미세한':'subtle','플레이크':'flakes',
  // lighting
  '강한':'strong','직광':'direct','플래시':'flash','고대비':'high contrast',
  '그림자':'shadows','에디토리얼':'editorial','조명':'lighting',
  '부드러운':'soft','자연광':'natural light','창가':'window',
  '따뜻한':'warm','톤':'tone','디퓨즈드':'diffused',
  '드라마틱':'dramatic','사이드':'side','라이팅':'lighting',
  '깊은':'deep','시네마틱':'cinematic',
  '링라이트':'ring light','오버헤드':'overhead','균일':'even','클린':'clean',
  // camera
  '아이레벨':'eye-level','살짝':'slightly','위':'above','도':'degree',
  '탑다운':'overhead top-down','로우앵글':'low angle looking up',
  '클로즈업':'close-up','미디엄':'medium distance','와이드':'wide shot',
  // materials & vessels (auto-style terms)
  '파이버글래스':'fiberglass','캠트레이':'camtray','세라믹볼':'ceramic bowl',
  '재활용 플라스틱':'recycled plastic terrazzo surface with very fine tiny speckles in one subtle tone-on-tone shade, appears nearly solid from a distance','테이블':'table',
  '코발트블루':'cobalt blue','테라코타':'terracotta','코랄핑크':'coral pink',
  '앰버골드':'amber gold','차콜그레이':'charcoal gray','올리브그린':'olive green',
  '네이비':'navy','아이보리':'ivory','크림화이트':'cream white',
  '세이지그린':'sage green','옐로우골드':'yellow gold','크래프트브라운':'kraft brown',
  '다크브라운':'dark brown','라벤더':'lavender','피치핑크':'peach pink',
  '머스타드':'mustard','옐로우':'yellow','크림베이지':'cream beige',
  '웜화이트':'warm white','쿨화이트':'cool white','오프화이트':'off-white',
  '라이트그레이':'light gray','쿨그레이':'cool gray','라이트블루그레이':'light blue-gray',
  '매트':'matte','벽':'wall',
  '라이트그린':'light green','레드':'red',
  '디저트':'dessert','플레이트':'plate','라운드':'round','넓은':'wide',
  '얕은':'shallow','파스타볼':'pasta bowl','국물볼':'soup bowl',
  '디핑종지':'dipping dish','커팅보드':'cutting board',
  '바게트':'baguette','슬라이스':'slice','토스트한':'toasted',
  '버터나이프':'butter knife','숟가락만':'spoon only',
  '칠리플레이크':'chili flakes','드리즐':'drizzle',
  '선드라이':'sun-dried','토마토':'tomato','트러플오일':'truffle oil',
  '마이크로그린':'microgreens','파르메산':'parmesan','쉐이빙':'shaving',
  '슈가파우더':'powdered sugar','더스팅':'dusting','카카오파우더':'cocoa powder',
  '말차파우더':'matcha powder','야채스틱':'vegetable sticks',
  '젓가락만':'chopsticks only',
  '잘게 썬 김':'finely shredded gim','잘게 썬 대파':'sliced green onion',
  '간장':'soy sauce','작은 종지':'small dish','종지':'dish','작은':'small','큰':'large',
  '디핑용':'for dipping','디핑':'dipping',
  // food desc
  '캔':'can','밀키트':'meal kit','조각':'slice','인분':'servings',
  // garnish
  '초록':'green','가니쉬':'garnish','허브':'herbs',
};

const PARTICLE_RX = /(?<=\s|^)[은는이가을를에서도의로으](?=\s|$)/g;

export function koToEn(text: string): string {
  if (!text) return '';
  // Already mostly English → as-is
  if (/^[a-zA-Z0-9\s,.\-/()&;:!'"]+$/.test(text)) return text;

  let result = text;
  // Longest keys first to avoid partial replacements
  const keys = Object.keys(KO_EN).sort((a, b) => b.length - a.length);
  for (const ko of keys) {
    result = result.split(ko).join(KO_EN[ko]);
  }
  result = result.replace(PARTICLE_RX, ' ');
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}
