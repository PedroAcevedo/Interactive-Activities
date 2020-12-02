function* badges_modal(badges_obtained, theme) {
  
  let index = 0;

  console.log(badges_obtained);

  while ( index < badges_obtained.length) {
    console.log('here');

    document.getElementById('head').innerHTML = `
        <color style="color:${theme['color']}">${badges['' + badges_obtained[index]['type_id']].name}</color>
      `;
    document.getElementById('badge').innerHTML = `
        ${badges['' + badges_obtained[index]['type_id']].svg.replace('fill=""', 'fill=' + theme['color']).replace("153.000000", "120pt")}
      `;
    document.getElementById('foot').innerHTML = `
      <color style="color:${theme['color']}">${badges['' + badges_obtained[index]['type_id']].description}</color>
      `;    
    
    $(`#badge_modal`).modal('toggle');

    yield index++;

  }

  $('#myModal').modal('toggle');

}
