document.getElementById("searchForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // 防止表单默认提交行为

    const query = this.querySelector("input").value; // 获取输入框的搜索关键词
    const apiUrl = `https://elated-real-narwhal.glitch.me/search?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(apiUrl); // 调用 API
        if (!response.ok) {
            throw new Error("API 调用失败");
        }

        const data = await response.json(); // 解析 API 返回结果
        displayResults(data); // 显示结果
    } catch (error) {
        console.error("搜索出错:", error);
        alert("无法获取搜索结果，请稍后再试！");
    }
});

// 显示结果的函数
function displayResults(results) {
    // 创建弹窗容器
    const modalContainer = document.createElement("div");
    modalContainer.style.position = "fixed";
    modalContainer.style.top = "50%";
    modalContainer.style.left = "50%";
    modalContainer.style.transform = "translate(-50%, -50%)";
    modalContainer.style.padding = "20px";
    modalContainer.style.backgroundColor = "#fff";
    modalContainer.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    modalContainer.style.zIndex = 1000;
    modalContainer.style.maxWidth = "400px";
    modalContainer.style.overflowY = "auto";
    modalContainer.style.borderRadius = "8px";

    // 添加关闭按钮
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.marginBottom = "10px";
    closeButton.style.float = "right";
    closeButton.style.backgroundColor = "#dc3545";
    closeButton.style.color = "#fff";
    closeButton.style.border = "none";
    closeButton.style.padding = "5px 10px";
    closeButton.style.borderRadius = "4px";
    closeButton.style.cursor = "pointer";
    closeButton.addEventListener("click", () => document.body.removeChild(modalContainer));
    modalContainer.appendChild(closeButton);

    // 添加搜索结果内容
    const resultList = document.createElement("ul");
    resultList.style.listStyle = "none";
    resultList.style.padding = 0;

    results.forEach(song => {
        const listItem = document.createElement("li");
        listItem.style.marginBottom = "10px";

        const link = document.createElement("a");
        link.href = song.link;
        link.textContent = `${song.title} - ${song.artist}`;
        link.target = "_blank"; // 新窗口打开
        link.style.textDecoration = "none";
        link.style.color = "#007bff";

        listItem.appendChild(link);
        resultList.appendChild(listItem);
    });

    modalContainer.appendChild(resultList);
    document.body.appendChild(modalContainer);
}

