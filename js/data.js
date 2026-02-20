// ═══════════════════════════════════════════════════
//  DATA — Game constants & state
// ═══════════════════════════════════════════════════
const ERAS=[
{id:0,name:'Sinh Tồn',label:'KỶ NGUYÊN 1 — SINH TỒN',pop:0},
{id:1,name:'Nông Nghiệp',label:'KỶ NGUYÊN 2 — NÔNG NGHIỆP',pop:5},
{id:2,name:'Thị Trấn',label:'KỶ NGUYÊN 3 — THỊ TRẤN',pop:20},
{id:3,name:'Công Nghiệp',label:'KỶ NGUYÊN 4 — CÔNG NGHIỆP',pop:60},
{id:4,name:'Hiện Đại',label:'KỶ NGUYÊN 5 — HIỆN ĐẠI',pop:150}
];
const RES=[
{id:'wood',name:'Gỗ',icon:'\u{1fab5}',era:0},{id:'stone',name:'Đá',icon:'\u{1faa8}',era:0},
{id:'food',name:'Thực phẩm',icon:'\u{1f356}',era:0},{id:'water',name:'Nước',icon:'\u{1f4a7}',era:0},
{id:'fiber',name:'Sợi TV',icon:'\u{1f33f}',era:0},{id:'clay',name:'Đất sét',icon:'\u{1f3fa}',era:0},
{id:'herbs',name:'Thảo dược',icon:'\u{1f331}',era:0},
{id:'wheat',name:'Lúa mì',icon:'\u{1f33e}',era:1},{id:'livestock',name:'Gia súc',icon:'\u{1f404}',era:1},
{id:'leather',name:'Da thuộc',icon:'\u{1f9b4}',era:1},{id:'honey',name:'Mật ong',icon:'\u{1f36f}',era:1},
{id:'iron',name:'Sắt',icon:'\u26cf\ufe0f',era:2},{id:'copper',name:'Đồng',icon:'\u{1f536}',era:2},
{id:'coal',name:'Than đá',icon:'\u26ab',era:2},{id:'glass',name:'Thủy tinh',icon:'\u{1f52e}',era:2},
{id:'marble',name:'Cẩm thạch',icon:'\u2b1c',era:2},{id:'coin',name:'Tiền xu',icon:'\u{1fa99}',era:2},
{id:'steel',name:'Thép',icon:'\u{1f529}',era:3},{id:'cement',name:'Xi măng',icon:'\u{1f9f1}',era:3},
{id:'machinery',name:'Máy móc',icon:'\u2699\ufe0f',era:3},{id:'electric',name:'Điện',icon:'\u26a1',era:3},
{id:'medicine',name:'Thuốc',icon:'\u{1f48a}',era:3},
{id:'silicon',name:'Silicon',icon:'\u{1f48e}',era:4},{id:'electronics',name:'Linh kiện',icon:'\u{1f50c}',era:4},
{id:'research',name:'Nghiên cứu',icon:'\u{1f52c}',era:4}
];
const NEEDS=[
{id:'hunger',name:'No đủ',icon:'\u{1f37d}\ufe0f',era:0,w:3,d:.8},{id:'thirst',name:'Nước uống',icon:'\u{1f6b0}',era:0,w:3,d:.9},
{id:'shelter',name:'Chỗ ở',icon:'\u{1f3e0}',era:0,w:2.5,d:.2},{id:'warmth',name:'Sưởi ấm',icon:'\u{1f525}',era:0,w:2,d:.5},
{id:'safety',name:'An toàn',icon:'\u{1f6e1}\ufe0f',era:0,w:2,d:.3},
{id:'health',name:'Sức khỏe',icon:'\u2764\ufe0f',era:1,w:2,d:.3},{id:'community',name:'Cộng đồng',icon:'\u{1f91d}',era:1,w:1.5,d:.2},
{id:'education',name:'Giáo dục',icon:'\u{1f4da}',era:2,w:1.5,d:.15},{id:'commerce',name:'Mua sắm',icon:'\u{1f6d2}',era:2,w:1.2,d:.2},
{id:'employment',name:'Việc làm',icon:'\u{1f4bc}',era:3,w:2,d:.25},{id:'leisure',name:'Giải trí',icon:'\u{1f3ea}',era:3,w:1.2,d:.2},
{id:'internet',name:'Internet',icon:'\u{1f4f6}',era:4,w:1.8,d:.3},{id:'environment',name:'Môi trường',icon:'\u{1f333}',era:4,w:1.5,d:.15}
];
const BLDS=[
{id:'campfire',name:'Lửa trại',icon:'\u{1f525}',era:0,cat:'Cơ bản',cost:{wood:5},prod:{warmth:.5},sz:1,c:'#ff6600',h:.3},
{id:'hut',name:'Túp lều',icon:'\u26fa',era:0,cat:'Nhà ở',cost:{wood:10,fiber:5},prod:{shelter:.8,safety:.3},sz:1,c:'#8B7355',h:.7,pop:2},
{id:'well',name:'Giếng nước',icon:'\u{1faa3}',era:0,cat:'Cơ bản',cost:{stone:8,wood:3},prod:{thirst:1},sz:1,c:'#5588aa',h:.5},
{id:'storage',name:'Kho chứa',icon:'\u{1f4e6}',era:0,cat:'Cơ bản',cost:{wood:15,stone:5},prod:{},sz:1,c:'#9B8B6B',h:.8},
{id:'farm',name:'Nông trại',icon:'\u{1f33e}',era:1,cat:'Sản xuất',cost:{wood:15,stone:5},prod:{hunger:1.5},sz:2,c:'#9acd32',h:.3},
{id:'ranch',name:'Chăn nuôi',icon:'\u{1f404}',era:1,cat:'Sản xuất',cost:{wood:20,fiber:10},prod:{hunger:.8},sz:2,c:'#c8a86e',h:.4},
{id:'woodhouse',name:'Nhà gỗ',icon:'\u{1f3e1}',era:1,cat:'Nhà ở',cost:{wood:25,stone:10,clay:5},prod:{shelter:1.5,warmth:.5},sz:1,c:'#A0785A',h:1,pop:4},
{id:'market',name:'Chợ',icon:'\u{1f3ea}',era:1,cat:'Dịch vụ',cost:{wood:20,stone:10},prod:{community:1,commerce:.5},sz:2,c:'#CD853F',h:.8},
{id:'mine',name:'Mỏ khai thác',icon:'\u26cf\ufe0f',era:2,cat:'Sản xuất',cost:{wood:30,stone:40},prod:{},sz:2,c:'#696969',h:.6},
{id:'forge',name:'Xưởng rèn',icon:'\u{1f528}',era:2,cat:'Sản xuất',cost:{stone:30,iron:15,coal:10},prod:{employment:.5},sz:1,c:'#555555',h:1},
{id:'stonehouse',name:'Nhà đá',icon:'\u{1f3d8}\ufe0f',era:2,cat:'Nhà ở',cost:{stone:40,iron:10},prod:{shelter:2.5,warmth:1},sz:1,c:'#888888',h:1.3,pop:6},
{id:'school',name:'Trường học',icon:'\u{1f3eb}',era:2,cat:'Dịch vụ',cost:{stone:35,wood:20},prod:{education:1.5},sz:2,c:'#CD6839',h:1.2},
{id:'factory',name:'Nhà máy',icon:'\u{1f3ed}',era:3,cat:'Sản xuất',cost:{steel:40,cement:30,machinery:10},prod:{employment:2},sz:2,c:'#666677',h:1.8},
{id:'apartment',name:'Chung cư',icon:'\u{1f3e2}',era:3,cat:'Nhà ở',cost:{cement:50,steel:30},prod:{shelter:4},sz:2,c:'#7A8A9A',h:2.5,pop:20},
{id:'hospital',name:'Bệnh viện',icon:'\u{1f3e5}',era:3,cat:'Dịch vụ',cost:{cement:40,steel:20,medicine:15},prod:{health:3},sz:2,c:'#EEEEEE',h:2},
{id:'skyscraper',name:'Cao ốc',icon:'\u{1f3d9}\ufe0f',era:4,cat:'Nhà ở',cost:{steel:80,silicon:10,electronics:15},prod:{shelter:8},sz:2,c:'#4488BB',h:4,pop:50},
{id:'datacenter',name:'Data Center',icon:'\u{1f5a5}\ufe0f',era:4,cat:'Hạ tầng',cost:{steel:50,electronics:40,silicon:20},prod:{internet:3},sz:2,c:'#2255AA',h:1.5},
{id:'park',name:'Công viên',icon:'\u{1f333}',era:4,cat:'Dịch vụ',cost:{cement:20,wood:15},prod:{environment:2,leisure:1},sz:2,c:'#33AA44',h:.3}
];

const SKINS=[new BABYLON.Color3(.96,.82,.66),new BABYLON.Color3(.83,.64,.45),new BABYLON.Color3(.78,.53,.26),new BABYLON.Color3(.55,.33,.14)];
const SHIRTS=[new BABYLON.Color3(.27,.53,.8),new BABYLON.Color3(.8,.27,.27),new BABYLON.Color3(.27,.67,.27),new BABYLON.Color3(.87,.67,.2)];

// ═══════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════
const G={era:0,day:1,speed:1,population:1,happiness:80,res:{},needLvl:{},buildings:[],selected:null,
  player:{hp:100,energy:100,action:'Đứng yên'}};
RES.forEach(r=>G.res[r.id]=r.era===0?20:0);G.res.food=30;G.res.water=30;
NEEDS.forEach(n=>G.needLvl[n.id]=n.era<=G.era?65+Math.random()*25:50);

const P={x:0,z:0,targetX:0,targetZ:0,moving:false,onArrive:null,busy:false};
