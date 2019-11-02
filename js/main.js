var dados = []
var clientes = []
var duracaoMedia = []
var ligacoesOutroDDD = 0

$( document ).ready(()=>{
  $('#relatorio-btn').prop('disabled', true)
  $('#relatorio-btn').addClass('btn disabled')
})

$('#relatorio-btn').click(geraRelatorio)

$('#upload-input').on().change(loadFile)

function loadFile (){
  console.info('Arquivo carregado')
  console.log(this.files)
  processFile(this.files)
}

function processFile(files){
  const reader = new FileReader()
  reader.onload = () => {
    var lines = reader.result.trim().split('\n')
    lines = lines.map(line => line.split(';'))
    header = lines.splice(0, 1)[0]
    dados = lines
    console.log({header},{dados})
  }
  reader.onloadend = () => {
    clientes = dados.map(arr => arr[1]) // Retorna array dos números
    clientes = clientes.filter((elem, i) => clientes.indexOf(elem) === i)// Elimina repetidos
    $('#relatorio-btn').prop('disabled', false)
    $('#relatorio-btn').removeClass('btn disabled')
    $('#relatorio-btn').addClass('btn orange white-text waves-light waves-effect')
  }
  reader.readAsText(files[0])
}

function geraRelatorio(){
  $('#relatorio-btn').prop('disabled', true)
  $('#relatorio-btn').addClass('btn disabled')
  clientes.forEach(cliente =>{
    dados.forEach(dado =>{
      if (cliente == dado[1]){
        if (cliente.substr(0,2) != dado[2].substr(0,2)){
          ligacoesOutroDDD++                                    // Mini-Pyramid of Doom
        }
      }
    })
  })

  var ddd = dados.map(elem => elem[1].substr(0,2))
      ddd = ddd.filter((elem, i) => ddd.indexOf(elem) === i)
  
  ddd.forEach(elem =>{
    var duracaoMediaArea = {area: null, media: 0}
        duracaoMediaArea.area = elem
    var duracao = 0
    var qnt = 0
    dados.forEach(dado =>{
      if (elem == dado[1].substr(0,2)){
        qnt++
        duracao += parseInt(dado[3])
      }
    })
    console.log('Duração total: '+duracao+' | Quantidade total: '+qnt)
    duracaoMediaArea.media = Math.round(duracao / qnt)
    duracaoMedia.push(duracaoMediaArea)
  })  

  document.getElementById('total-cli-ligaram').innerText += ` ${clientes.length}`
  document.getElementById('total-outro-ddd').innerText += ` ${ligacoesOutroDDD}`
  duracaoMedia.forEach(knot => {
    var p = document.createElement('a')
    p.innerText = `DDD: ${knot.area} - Tempo Médio: ${knot.media}`
    $(p).addClass('collection-item orange white-text')
    $(p).css('margin', '0')
    document.getElementById('lista-ddd').appendChild(p)
  })
  
  var texto = `TOTAL_CLIENTES_LIGARAM: ${clientes.length} \n`+
              `DURACAO_MEDIA: \n`
  duracaoMedia.forEach(elem =>{
    texto += `${elem.area}: ${elem.media} \n`
  })
  texto += `TOTAL_CLIENTES_LIGARAM_OUTRO_DDD: ${ligacoesOutroDDD}`

  download(texto)
}

function download(data, filename = 'relatorio') {
  var file = new Blob([data], {type: data.type});
  if (window.navigator.msSaveOrOpenBlob)
  {
      window.navigator.msSaveOrOpenBlob(file, filename);
  } else  {
      var a = document.createElement('a'), url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
  }
}