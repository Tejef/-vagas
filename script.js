async function buscar() {
  const termo = document.getElementById("barra-pesquisa").value.trim();
  const resultados = document.getElementById("resultados");

  if (termo === '') {
    resultados.innerHTML = "<p>Por favor, digite um termo para buscar.</p>";
    return;
  }

  resultados.innerHTML = 'Carregando...';

  try {
    const res = await fetch(`/estacionamentos?nome=${encodeURIComponent(termo)}`);
    if (!res.ok) throw new Error('Erro na requisição');

    const dados = await res.json();

    resultados.innerHTML = '';

    if (dados.length === 0) {
      resultados.innerHTML = "<p>Nenhum estacionamento encontrado.</p>";
    } else {
      dados.forEach(est => {
        const abertoAgora = verificarAberto(est.abre, est.fecha);

        const div = document.createElement('div');
        div.className = 'estacionamento';

        div.innerHTML = `
          <img src="${est.imagem}" alt="${est.nome}">
          <div class="info">
            <h3>${est.nome}</h3>
            <p>${est.local}</p>
            <p>${abertoAgora ? '<span style="color:green">Aberto</span>' : '<span style="color:red">Fechado</span>'}</p>
            <button onclick="verEstacionamento(${est.id})">Ver</button>
          </div>
        `;
        resultados.appendChild(div);
      });
    }
  } catch (err) {
    resultados.innerHTML = "<p>Erro ao buscar dados.</p>";
    console.error(err);
  }
}

function verificarAberto(horaAbre, horaFecha) {
  const agora = new Date();
  const horaAtual = agora.getHours() * 60 + agora.getMinutes(); // em minutos

  const [abreH, abreM] = horaAbre.split(':').map(Number);
  const [fechaH, fechaM] = horaFecha.split(':').map(Number);

  const abreMin = abreH * 60 + abreM;
  const fechaMin = fechaH * 60 + fechaM;

  // Verifica se hora atual está dentro do intervalo de funcionamento
  return horaAtual >= abreMin && horaAtual <= fechaMin;
}

function verEstacionamento(id) {
  alert(`Clicou no estacionamento ID: ${id}`);
  // Aqui você pode abrir detalhes ou redirecionar
}
