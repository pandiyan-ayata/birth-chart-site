/* Exports the generated jathagam (header + results + footer) as a
   downloadable PDF, using html2canvas (DOM -> image) and jsPDF
   (image -> multi-page PDF). Both libraries are loaded from a CDN in
   index.html; this file only orchestrates them. */
(function (global) {
  "use strict";

  function buildCaptureNode(resultSection) {
    var wrap = document.createElement("div");
    wrap.style.position = "fixed";
    wrap.style.left = "-10000px";
    wrap.style.top = "0";
    wrap.style.width = "820px";
    wrap.style.background = "#f3ead4";
    wrap.className = "pdf-capture";

    var header = document.querySelector(".site-header").cloneNode(true);
    var resultClone = resultSection.cloneNode(true);
    resultClone.hidden = false;
    // The style-toggle and download button itself don't belong on paper.
    var toggle = resultClone.querySelector(".style-toggle");
    if (toggle) toggle.remove();
    var pdfAction = resultClone.querySelector(".pdf-action");
    if (pdfAction) pdfAction.remove();

    var footer = document.querySelector(".site-footer").cloneNode(true);

    wrap.appendChild(header);
    wrap.appendChild(resultClone);
    wrap.appendChild(footer);
    document.body.appendChild(wrap);
    return wrap;
  }

  function exportResultToPdf(opts) {
    var resultSection = opts.resultSection;
    var fileName = opts.fileName || "jathagam.pdf";
    var statusEl = opts.statusEl;

    function setStatus(msg) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.hidden = !msg;
    }

    if (!global.html2canvas || !global.jspdf) {
      setStatus("PDF கருவி ஏற்றப்படவில்லை. இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.");
      return Promise.resolve();
    }

    setStatus("PDF தயாராகிறது\u2026");

    var node = buildCaptureNode(resultSection);

    var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();

    return fontsReady
      .then(function () {
        return global.html2canvas(node, {
          scale: 2,
          backgroundColor: "#12141f",
          useCORS: true
        });
      })
      .then(function (canvas) {
        var jsPDF = global.jspdf.jsPDF;
        var pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
        var pageWidth = pdf.internal.pageSize.getWidth();
        var pageHeight = pdf.internal.pageSize.getHeight();

        var imgWidth = pageWidth;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var imgData = canvas.toDataURL("image/png");

        var heightLeft = imgHeight;
        var position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(fileName);
        setStatus("");
      })
      .catch(function (err) {
        setStatus("PDF உருவாக்கத்தில் பிழை: " + err.message);
      })
      .finally(function () {
        if (node.parentNode) document.body.removeChild(node);
      });
  }

  global.PdfExport = { exportResultToPdf: exportResultToPdf };
})(window);
