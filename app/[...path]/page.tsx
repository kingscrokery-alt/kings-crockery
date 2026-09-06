import Storefront from '../storefront';
export default async function Page({params}:{params:Promise<{path?:string[]}>}){const {path=[]}=await params;return <Storefront path={'/'+path.join('/')}/>}
