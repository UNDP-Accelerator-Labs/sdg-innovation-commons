import Txt from './text';
import Embed from './embed';
import List from './list';
import Img from './img';
import Checklist from './checklist';
import Attachment from './attachment';

export default function renderComponents (items: any[], item: any, i: number, imgBase?: string) {
    const { type } = item;
    if (type === 'txt') return (<Txt key={i} item={item} />) 
    if (type === 'embed') return (<Embed key={i} item={item} />) 
    if (type === 'list') return (<List key={i} item={item} />) 
    if (type === 'img') return (<Img key={i} item={item} base={imgBase || ''} />) 
    if (type === 'mosaic') return (<Img key={i} item={item} base={imgBase || ''} />) 
    if (['checklist', 'radiolist'].includes(type)) {
        let mb: string = '';
        const nextType: string | undefined = items[i + 1]?.type;
        if (nextType && !['checklist', 'radiolist'].includes(nextType)) mb = 'mb-[40px]';
        return (<Checklist key={i} item={item} className={mb} />)
    }

    if (type === 'attachment') return (<Attachment key={i} item={item} />)
    console.log(type)
}