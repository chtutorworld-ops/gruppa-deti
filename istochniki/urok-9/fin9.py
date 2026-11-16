# слоги новых финалей ai ei ao ou an en с пройденными инициалями -> иероглиф для синтезатора (без многозначных)
FIN = {
'ai':'bāi掰 bái白 bǎi百 bài败 pāi拍 pái牌 pài派 mái埋 mǎi买 mài卖 dāi呆 dài带 tāi胎 tái台 tài太 nǎi奶 nài耐 lái来 lài赖 gāi该 gǎi改 gài盖 kāi开 kǎi凯 hái孩 hǎi海 hài害 zāi灾 zǎi宰 zài在 cāi猜 cái才 cǎi彩 cài菜 sāi腮 sài赛 zhāi摘 zhǎi窄 zhài债 chāi拆 chái柴 shāi筛 shài晒',
'ei':'bēi杯 běi北 bèi被 pēi胚 péi陪 pèi配 méi梅 měi美 mèi妹 fēi飞 féi肥 fěi匪 fèi费 nèi内 léi雷 lèi类 gěi给 hēi黑 zéi贼',
'ao':'bāo包 bǎo宝 bào报 pāo抛 pǎo跑 māo猫 máo毛 mào帽 dāo刀 dǎo岛 dào到 tāo掏 táo桃 tǎo讨 tào套 náo挠 nǎo脑 nào闹 lāo捞 láo劳 lǎo老 gāo高 gǎo搞 gào告 kǎo考 kào靠 háo毫 hǎo好 hào耗 zāo糟 zǎo早 zào造 cāo操 cǎo草 sǎo扫 zhāo招 zhǎo找 zhào照 chāo超 cháo潮 chǎo吵 shāo烧 sháo勺 shào哨',
'ou':'pōu剖 móu谋 fǒu否 dōu兜 dǒu抖 dòu豆 tōu偷 tóu头 tòu透 lóu楼 lòu漏 gōu沟 gǒu狗 gòu够 kōu抠 kǒu口 kòu扣 hóu猴 hǒu吼 hòu后 zǒu走 zòu奏 còu凑 sōu搜 zhōu周 zhóu轴 zhǒu肘 zhòu皱 chōu抽 chóu愁 chǒu丑 shōu收 shǒu手 shòu瘦',
'an':'bān班 bǎn板 bàn半 pān攀 pán盘 pàn盼 mán馒 mǎn满 màn慢 fān翻 fán烦 fǎn反 fàn饭 dān单 dǎn胆 dàn蛋 tān摊 tán谈 tǎn毯 tàn叹 nán南 lán蓝 lǎn懒 làn烂 gān甘 gǎn感 kān刊 kǎn砍 kàn看 hán寒 hǎn喊 hàn汗 zán咱 zàn赞 cān餐 cán蚕 cǎn惨 càn灿 sān三 sǎn伞 zhān沾 zhǎn展 zhàn站 chán馋 chǎn产 shān山 shǎn闪 shàn善',
'en':'bēn奔 běn本 bèn笨 pēn喷 pén盆 mén门 fēn分 fén坟 fěn粉 fèn份 nèn嫩 gēn跟 kěn肯 hén痕 hěn很 hèn恨 zěn怎 sēn森 zhēn真 zhěn枕 zhèn阵 chén陈 chèn趁 shēn深 shén神 shěn审 shèn肾',
}
import re, json
out = {k: [[m.group(1), m.group(2)] for m in re.finditer(r'([a-zāáǎàēéěèīíǐìōóǒòūúǔù]+)(\S)', v)] for k, v in FIN.items()}
if __name__ == '__main__':
    print(json.dumps(out, ensure_ascii=False))
    print(sum(len(v) for v in out.values()), file=__import__('sys').stderr)
