// ImageFinder - Unsplash API + graceful demo mode
const ACCESS_KEY = ''; // Optional: paste your Unsplash Access Key here, or use demo mode.
const API_URL = 'https://api.unsplash.com/search/photos';
const gallery = document.querySelector('#gallery');
const searchInput = document.querySelector('#searchInput');
const form = document.querySelector('#searchForm');
const statusBox = document.querySelector('#status');
const title = document.querySelector('#resultsTitle');
const subtitle = document.querySelector('#resultsSubtitle');
const count = document.querySelector('#resultCount');
const loadMore = document.querySelector('#loadMore');
const dialog = document.querySelector('#lightbox');
const modalImage = document.querySelector('#modalImage');
const modalTitle = document.querySelector('#modalTitle');
const modalCredit = document.querySelector('#modalCredit');
const downloadLink = document.querySelector('#downloadLink');
let query = '', page = 1, totalPages = 1, items = [], modalIndex = 0, debounceTimer;

const demoPhotos = [
 {id:'d1',alt:'Sunlit mountain landscape',urls:{regular:'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=85',full:'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1600&q=90'},user:{name:'Unsplash photography',links:{html:'https://unsplash.com'}}},
 {id:'d2',alt:'Beautiful coast and ocean',urls:{regular:'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85',full:'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=90'},user:{name:'Unsplash photography',links:{html:'https://unsplash.com'}}},
 {id:'d3',alt:'Forest trees and sunlight',urls:{regular:'https://images.unsplash.com/photo-144837amin?auto=format&fit=crop&w=900&q=85',full:'https://images.unsplash.com/photo-144837amin?auto=format&fit=crop&w=1600&q=90'},user:{name:'Unsplash photography',links:{html:'https://unsplash.com'}}},
 {id:'d4',alt:'Minimal modern architecture',urls:{regular:'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=85',full:'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=90'},user:{name:'Unsplash photography',links:{html:'https://unsplash.com'}}},
 {id:'d5',alt:'Coffee and cozy workspace',urls:{regular:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85',full:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=90'},user:{name:'Unsplash photography',links:{html:'https://unsplash.com'}}},
 {id:'d6',alt:'Travel city street',urls:{regular:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85',full:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=90'},user:{name:'Unsplash photography',links:{html:'https://unsplash.com'}}},
 {id:'d7',alt:'Fresh flowers in a vase',urls:{regular:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85',full:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=90'},user:{name:'Unsplash photography',links:{html:'https://unsplash.com'}}},
 {id:'d8',alt:'Desert dunes at golden hour',urls:{regular:'https://images.unsplash.com/photo-1509318530623-7b5?auto=format&fit=crop&w=900&q=85',full:'https://images.unsplash.com/photo-1509318530623-7b5?auto=format&fit=crop&w=1600&q=90'},user:{name:'Unsplash photography',links:{html:'https://unsplash.com'}}}
];
function showStatus(message, type='') { statusBox.hidden=false; statusBox.className='status '+type; statusBox.innerHTML=message; }
function hideStatus(){statusBox.hidden=true;statusBox.className='status';statusBox.textContent='';}
function cardFor(photo,index){
 const card=document.createElement('article');card.className='photo-card';card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label',`View ${photo.alt||'photo'}`);
 const img=document.createElement('img');img.src=photo.urls.small||photo.urls.regular;img.alt=photo.alt_description||photo.alt||'Search result image';img.loading='lazy';
 img.onerror=()=>{card.remove();};
 const overlay=document.createElement('div');overlay.className='photo-overlay';
 const strong=document.createElement('strong');strong.textContent=photo.alt_description||photo.alt||'Beautiful photo';
 const small=document.createElement('small');small.textContent=`Photo by ${photo.user?.name||'Photographer'}`;
 overlay.append(strong,small);card.append(img,overlay);
 card.addEventListener('click',()=>openLightbox(index));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')openLightbox(index)});
 return card;
}
function render(list,append=false){
 if(!append)gallery.innerHTML='';
 list.forEach((p,i)=>gallery.appendChild(cardFor(p,append?items.length-list.length+i:i)));
 count.textContent=items.length?`${items.length} images`: '';
 loadMore.hidden=!(ACCESS_KEY&&page<totalPages);
}
function demoSearch(q){
 const words=q.toLowerCase().split(/\s+/);
 const matched=demoPhotos.filter(p=>words.some(w=>p.alt.toLowerCase().includes(w)));
 // For demo searches that do not match the small local set, show the curated gallery.
 return matched.length?matched:demoPhotos;
}
async function searchImages(q,newSearch=true){
 if(!q.trim())return;
 if(newSearch){query=q.trim();page=1;items=[];gallery.innerHTML='';title.textContent=`Results for “${query}”`;subtitle.textContent=ACCESS_KEY?'Searching Unsplash photography':'Demo gallery · add an API key for live search';}
 showStatus('<span class="spinner"></span> Finding beautiful images…');
 loadMore.hidden=true;
 try{
  if(!ACCESS_KEY){await new Promise(r=>setTimeout(r,250));items=demoSearch(query);hideStatus();render(items);subtitle.textContent='Demo images · configure an Unsplash key for live keyword search';return;}
  const res=await fetch(`${API_URL}?query=${encodeURIComponent(query)}&page=${page}&per_page=20`,{headers:{Authorization:`Client-ID ${ACCESS_KEY}`}});
  if(!res.ok)throw new Error(res.status===401?'Invalid Unsplash API key. Check your access key.':res.status===403?'Unsplash API rate limit reached. Try again later.':`Request failed (${res.status})`);
  const data=await res.json();totalPages=data.total_pages||1;
  if(newSearch)items=data.results||[];else items=items.concat(data.results||[]);
  hideStatus();
  if(!items.length){showStatus(`No images found for <b>${escapeHtml(query)}</b>. Try another keyword.`);return;}
  render(items,!newSearch);subtitle.textContent=`${data.total?.toLocaleString()||items.length} images found on Unsplash`;
 }catch(err){showStatus(`${escapeHtml(err.message)}<br><br>Check your internet connection or API key, then try again.`,'error');}
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function openLightbox(index){modalIndex=index;updateModal();dialog.showModal();}
function updateModal(){const p=items[modalIndex];if(!p)return;modalImage.src=p.urls.full||p.urls.regular;modalImage.alt=p.alt_description||p.alt||'Photo';modalTitle.textContent=p.alt_description||p.alt||'Beautiful image';modalCredit.textContent=`Photo by ${p.user?.name||'Photographer'}`;downloadLink.href=p.links?.download||p.urls.full||p.urls.regular;downloadLink.download='image';}
function changeModal(delta){modalIndex=(modalIndex+delta+items.length)%items.length;updateModal();}
form.addEventListener('submit',e=>{e.preventDefault();searchImages(searchInput.value);});
searchInput.addEventListener('input',()=>{clearTimeout(debounceTimer);debounceTimer=setTimeout(()=>{if(searchInput.value.trim())searchImages(searchInput.value);},550);});
document.querySelectorAll('[data-query]').forEach(btn=>btn.addEventListener('click',()=>{searchInput.value=btn.dataset.query;searchImages(btn.dataset.query);}));
loadMore.addEventListener('click',()=>{if(page<totalPages){page++;searchImages(query,false);}});
document.querySelector('#closeModal').addEventListener('click',()=>dialog.close());
document.querySelector('#prevImage').addEventListener('click',()=>changeModal(-1));
document.querySelector('#nextImage').addEventListener('click',()=>changeModal(1));
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
document.addEventListener('keydown',e=>{if(dialog.open&&e.key==='ArrowRight')changeModal(1);if(dialog.open&&e.key==='ArrowLeft')changeModal(-1);});
searchImages('nature');
