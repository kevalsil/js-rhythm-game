window.onload = function() {
    const title = document.getElementById('title');
    
    // 애니메이션이 끝난 후 메인 페이지로 이동
    setTimeout(function() {
      window.location.href = 'html/main.html'; // 로비 페이지로 이동
    }, 3000); // 애니메이션 길이와 일치
  };
  