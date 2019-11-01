var dados = []
var clientes = []
var duracaoMedia = []
var ligacoesOutroDDD = 0

$( document ).ready(()=>{
  $('#relatorio-btn').prop('disabled', true)
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
  }
  reader.readAsText(files[0])
}

function geraRelatorio(){
  $('#relatorio-btn').prop('disabled', true)
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
    var p = document.createElement('li')
    p.innerText = `DDD: ${knot.area} - Tempo Médio: ${knot.media}`
    document.getElementById('lista-ddd').appendChild(p)
  })
  
}