// Apenas um exemplo de interação simples:
// Poderia usar para scroll suave ao clicar no menu
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault()
    document.querySelector(link.getAttribute('href')).scrollIntoView({behavior:'smooth'})
  })
})
