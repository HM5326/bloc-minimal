document.addEventListener("DOMContentLoaded", () => {
  const btnSupprime = document.querySelectorAll(".confirmDelete");
  btnSupprime.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const ok = confirm("Supprimer cette publication ?");
      if (!ok) {
        e.preventDefault();
      };
    });
  });

  const textareas = document.querySelectorAll('textarea');
  textareas.forEach(ts => {
    const resize = () => {
      ts.style.height = 'auto';
      ts.style.height = ts.scrollHeight + 'px';
    };
    ts.addEventListener('input', resize);
    // initial
    resize();
  });
});
