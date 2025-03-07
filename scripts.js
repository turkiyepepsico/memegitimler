document.addEventListener("DOMContentLoaded", function () {
    const repoOwner = "kullaniciadi"; // GitHub kullanıcı adın
    const repoName = "mem-egitim";    // Repo adı
    const folderPath = "egitimler";   // İçeriğin olduğu klasör

    const menuList = document.getElementById("menu-list");

    async function fetchFiles() {
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`;
        try {
            let response = await fetch(url);
            let files = await response.json();

            if (!Array.isArray(files)) {
                menuList.innerHTML = "Dosya bulunamadı!";
                return;
            }

            menuList.innerHTML = ""; // Menüyü temizle

            files.forEach(file => {
                if (file.type === "dir") {
                    // Eğer klasörse, alt klasörleri listele
                    let folderItem = document.createElement("div");
                    folderItem.innerHTML = `<strong>📁 ${file.name}</strong>`;
                    menuList.appendChild(folderItem);

                    fetchSubFiles(file.name);
                } else {
                    // Eğer dosyaysa, menüye ekle
                    let link = document.createElement("a");
                    link.href = "#";
                    link.textContent = "📄 " + file.name;
                    link.onclick = () => openFile(file.download_url);
                    menuList.appendChild(link);
                }
            });

        } catch (error) {
            menuList.innerHTML = "Bağlantı hatası!";
            console.error("GitHub API Hatası:", error);
        }
    }

    async function fetchSubFiles(folderName) {
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}/${folderName}`;
        try {
            let response = await fetch(url);
            let files = await response.json();

            files.forEach(file => {
                if (file.type === "file") {
                    let subLink = document.createElement("a");
                    subLink.href = "#";
                    subLink.style.marginLeft = "20px"; // Alt menü girintisi
                    subLink.textContent = "📄 " + file.name;
                    subLink.onclick = () => openFile(file.download_url);
                    menuList.appendChild(subLink);
                }
            });

        } catch (error) {
            console.error("Alt klasör yükleme hatası:", error);
        }
    }

    function openFile(url) {
        document.getElementById("viewer").src = url;
    }

    fetchFiles();
});
