export function getParams(location) {
    const searchParams = new URLSearchParams(location.search);
    return {
      status: searchParams.get('status') || '',
      start: searchParams.get('start') || null,
      end: searchParams.get('end') || null,
      label: searchParams.get('label') || null
    };
}

export function setParams( query ) {
  const searchParams = new URLSearchParams();
  if(query.status)
   searchParams.set("status", query.status);
  if(query.start != null){
    searchParams.set("start", query.start);
    searchParams.set("end", query.end);
    if(query.label != null)
      searchParams.set("label",query.label);
  } 
  return searchParams.toString();
}

