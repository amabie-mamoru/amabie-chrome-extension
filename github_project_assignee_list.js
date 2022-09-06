(() => {
    const func = () => {
        // プロジェクトページか確認する
        const current_url = location.href;
        const regex = /https:\/\/github\.com\/[^\/]+\/[^\/]+\/projects\/[0-9]+/g;
        const project_url = current_url.match(regex);

        // プロジェクトページじゃなかったらそもそも何もしない
        if (project_url === null) {
            return;
        }

        // アバターのアイコンを表示する DOM
        let avatarUserDom = document.querySelectorAll('.pc-AvatarItem');

        // アイコンをハッシュにまとめる
        let userIconHash = {};
        avatarUserDom.forEach((node) => {
            userIconHash[node.alt] = node.src;
        });

        // issue や card を表示する DOM
        let projectColumnsDom = document.getElementById('memex-project-view-root');

        // assignee で絞り込むときのクエリ(面倒なので & はエンコード後のものを直接書いた)
        const query = '?card_filter_query=assignee%3A'

        // アサインアイコンをまとめるための ul
        let ul = document.createElement("ul");
        ul.style = "display: flex; list-style: none; margin: 10px 10px 0 10px; align-items: center;";
        let li = document.createElement("li");
        let p = document.createElement("p");
        p.textContent = "link of assignee members: ";
        li.appendChild(p);
        ul.appendChild(li);

        Object.keys(userIconHash).map(key => {
            // avatarUserDom の forEach はループ数が多いのでこっちで replace する
            let userName = key.replace("@", "");
            let li = document.createElement("li");
            li.style = "margin: 0 5px;";
            let a = document.createElement("a");
            a.href = `${project_url}${query}${userName}`;
            a.title = userName;
            let img = document.createElement('img');
            img.src = userIconHash[key];
            img.width = 30;
            img.height = 30;
            img.style = "border-radius: 50%;";
            a.appendChild(img);
            li.appendChild(a);
            ul.appendChild(li);
        });
        projectColumnsDom.prepend(ul);
    };

    // DOMContentLoaded だと他スクリプトに上書きされることが確認されたのでやむなく load で
    window.addEventListener('load', () => {
        // 馬鹿っぽいけど、プロジェクト内の issue や card は遅延更新で、このリクエストを捕捉できなかったのでやむなく1秒待つ
        setTimeout(func, 1000);
    });
})();
