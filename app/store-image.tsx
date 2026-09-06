'use client';
/* oxlint-disable next/no-img-element -- Local fallback and CDN images use the existing native image layout. */
import {useState, type ComponentProps} from 'react';
export const replacementPhoto = '/images/kings-crockery-store.png';
/** Preserve healthy photographs; replace failed requests with the owner's supplied store photo. */
export default function StoreImage({src,alt,className='',onError,...props}:ComponentProps<'img'>){
  const [failedSource,setFailedSource]=useState<string>();
  const source=typeof src==='string'?src:'';
  const useReplacement=!source||failedSource===source||source===replacementPhoto;
  return <img ref={node=>{if(node?.complete&&node.naturalWidth===0&&!useReplacement)setFailedSource(source)}} {...props} src={useReplacement?replacementPhoto:source} alt={useReplacement?'Kings Crockery cookware and crockery display':alt} className={`${className}${useReplacement?' replacement-image':''}`} onError={event=>{if(!useReplacement)setFailedSource(source);onError?.(event)}}/>;
}
