function calcularJurosCompostos(valorInicial, taxa, anos, depositoMensal = 0) {
    const meses = anos * 12;
    const taxaMensal = (taxa / 100) / 12;
    
    let montanteFinal = valorInicial * Math.pow(1 + taxaMensal, meses);

    if (depositoMensal > 0) {
        let depositoAcumulado = depositoMensal * ((Math.pow(1 + taxaMensal, meses) - 1) / taxaMensal);
        montanteFinal += depositoAcumulado;
    }

    return montanteFinal;
}

function calcularJurosSimples(valorInicial, taxa, anos, depositoMensal = 0) {
    let montanteFinal = valorInicial + (valorInicial * (taxa / 100) * anos);

    if (depositoMensal > 0) {
        const meses = anos * 12;
        let depositoAcumulado = depositoMensal * meses;
        montanteFinal += depositoAcumulado;
    }

    return montanteFinal;
}

function ajustarPelaInflacao(montanteFinal, taxaInflacao, anos) {
    return montanteFinal / Math.pow(1 + (taxaInflacao / 100), anos);
}

function calcularJurosCompostos(valorInicial, taxa, anos, depositoMensal = 0) {
    const meses = anos * 12;
    const taxaMensal = (taxa / 100) / 12;
    
    let montanteFinal = valorInicial * Math.pow(1 + taxaMensal, meses);

    if (depositoMensal > 0) {
        let depositoAcumulado = depositoMensal * ((Math.pow(1 + taxaMensal, meses) - 1) / taxaMensal);
        montanteFinal += depositoAcumulado;
    }

    return montanteFinal;
}

function calcularJurosSimples(valorInicial, taxa, anos, depositoMensal = 0) {
    let montanteFinal = valorInicial + (valorInicial * (taxa / 100) * anos);

    if (depositoMensal > 0) {
        const meses = anos * 12;
        let depositoAcumulado = depositoMensal * meses;
        montanteFinal += depositoAcumulado;
    }

    return montanteFinal;
}

function ajustarPelaInflacao(montanteFinal, taxaInflacao, anos) {
    return montanteFinal / Math.pow(1 + (taxaInflacao / 100), anos);
}

function formatarComoPorcentagem(input) {
    let valor = input.value.replace('%', '').replace(',', '.');
    let valorNumerico = parseFloat(valor);

    if (!isNaN(valorNumerico)) {
        input.value = valorNumerico.toFixed(2) + '%';
    } else {
        input.value = '';
    }
}

function limparPorcentagem(input) {
    let valor = input.value.replace('%', '').replace(',', '.');
    return parseFloat(valor);
}

document.getElementById("investment-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const valorInicial = parseFloat(document.getElementById("valorInicial").value);
    const taxaInput = document.getElementById("taxaDeJuros");
    const inflacaoInput = document.getElementById("taxaDeInflacao");

    const taxa = limparPorcentagem(taxaInput);
    const inflacao = limparPorcentagem(inflacaoInput);

    const anos = parseFloat(document.getElementById("anos").value);
    const depositoMensal = parseFloat(document.getElementById("depositoMensal").value) || 0;
    const tipo = document.getElementById("tipoDeInvestimento").value;

    let montanteFinal;

    if (tipo === "composto") {
        montanteFinal = calcularJurosCompostos(valorInicial, taxa, anos, depositoMensal);
    } else {
        montanteFinal = calcularJurosSimples(valorInicial, taxa, anos, depositoMensal);
    }

    const montanteAjustado = ajustarPelaInflacao(montanteFinal, inflacao, anos);

    let montanteFinalFormatado = montanteFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    let montanteAjustadoFormatado = montanteAjustado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    document.getElementById('resultado-final').innerText = montanteFinalFormatado;
    document.getElementById('resultado-inflacao').innerText = montanteAjustadoFormatado;

    document.querySelector('.resultado').style.display = 'block';
    document.querySelector('.text-grafico').style.display = 'block';

    gerarGrafico(anos, valorInicial, taxa, depositoMensal, inflacao);
});

document.getElementById('taxaDeJuros').addEventListener('focus', function() {
    this.value = this.value.replace('%', '');
});

document.getElementById('taxaDeInflacao').addEventListener('focus', function() {
    this.value = this.value.replace('%', '');
});

function gerarGrafico(anos, valorInicial, taxa, depositoMensal, inflacao) {
    const ctx = document.getElementById('investmentChart').getContext('2d');
    const labels = Array.from({ length: anos }, (_, i) => i + 1);
    const montanteComposto = [];
    const montanteSimples = [];

    for (let i = 0; i < anos; i++) {
        let ano = i + 1;
        let montanteFinalComposto = calcularJurosCompostos(valorInicial, taxa, ano, depositoMensal);
        let montanteFinalSimples = calcularJurosSimples(valorInicial, taxa, ano, depositoMensal);
        
        montanteComposto.push(montanteFinalComposto);
        montanteSimples.push(montanteFinalSimples);
    }

    const montanteAjustadoComposto = montanteComposto.map((valor) => ajustarPelaInflacao(valor, inflacao, anos));
    const montanteAjustadoSimples = montanteSimples.map((valor) => ajustarPelaInflacao(valor, inflacao, anos));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Crescimento do Investimento (Composto)',
                    data: montanteComposto,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
                {
                    label: 'Crescimento do Investimento (Simples)',
                    data: montanteSimples,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                },
                {
                    label: 'Montante Ajustado pela Inflação (Composto)',
                    data: montanteAjustadoComposto,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                },
                {
                    label: 'Montante Ajustado pela Inflação (Simples)',
                    data: montanteAjustadoSimples,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'black'
                    }
                },
                x: {
                    ticks: {
                        color: 'black'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'black'
                    }
                }
            }
        }
    });
}




