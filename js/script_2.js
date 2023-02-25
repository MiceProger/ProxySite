function dropdownRedirectLink(dir) {
    // Директории
    let path = window.location.pathname;
    // Правая часть url
    let url = path + window.location.search;
    
    // Убираем языковую директорию
    if (path.charAt(0) === "/" && path.charAt(3) === "/") {
        url = path.substring(3) + window.location.search;
    }
    // Собираем обратно url
    url = window.location.origin + dir + url;
    
    // Редирект
    location.href = url;
}