    // Elementos do Perfil
    const profileImg = document.getElementById('profileImg');
    const imageUpload = document.getElementById('imageUpload');
    const displayProfileName = document.getElementById('displayProfileName');
    const displayProfileRole = document.getElementById('displayProfileRole');
    const displayProfileEducation = document.getElementById('displayProfileEducation');

    // Elementos de Edição
    const toggleEditBtn = document.getElementById('toggleEditBtn');
    const editForm = document.getElementById('editForm');
    const inputName = document.getElementById('inputName');
    const inputRole = document.getElementById('inputRole');
    const inputEducation = document.getElementById('inputEducation');
    const saveProfileBtn = document.getElementById('saveProfileBtn');

    // Elementos do Feed e Busca
    const publishBtn = document.getElementById('publishBtn');
    const postInput = document.getElementById('postInput');
    const postsFeed = document.getElementById('postsFeed');
    const searchInput = document.getElementById('searchInput');

    // 🔍 1. Funcionalidade de Busca de Empresas e Setores
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      // Busca nos Posts do Feed
      const posts = document.querySelectorAll('.post-card');
      posts.forEach(post => {
        const company = (post.getAttribute('data-company') || '').toLowerCase();
        const category = (post.getAttribute('data-category') || '').toLowerCase();
        const content = post.querySelector('.post-content').textContent.toLowerCase();

        if (company.includes(query) || category.includes(query) || content.includes(query)) {
          post.classList.remove('hidden');
        } else {
          post.classList.add('hidden');
        }
      });

      // Busca nas Sugestões de Empresas (Sidebar Direita)
      const suggestions = document.querySelectorAll('.suggestion-item');
      suggestions.forEach(item => {
        const company = (item.getAttribute('data-company') || '').toLowerCase();
        const category = (item.getAttribute('data-category') || '').toLowerCase();

        if (company.includes(query) || category.includes(query)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });

    // 2. Upload e alteração da foto de perfil
    imageUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          profileImg.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // 3. Mostrar/Ocultar formulário de edição de perfil
    toggleEditBtn.addEventListener('click', () => {
      editForm.style.display = (editForm.style.display === 'block') ? 'none' : 'block';
    });

    // 4. Salvar alterações do perfil
    saveProfileBtn.addEventListener('click', () => {
      displayProfileName.textContent = inputName.value.trim() || 'Nome não definido';
      displayProfileRole.textContent = inputRole.value.trim() || 'Cargo não definido';
      displayProfileEducation.textContent = inputEducation.value.trim() || 'Sem formações cadastradas';

      editForm.style.display = 'none';
      alert('Perfil atualizado com sucesso!');
    });

    // 5. Criar Postagem com os dados e foto do perfil atual
    publishBtn.addEventListener('click', () => {
      const text = postInput.value.trim();

      if (text === '') {
        alert('Por favor, digite algo antes de publicar!');
        return;
      }

      const currentName = displayProfileName.textContent;
      const currentRole = displayProfileRole.textContent;
      const currentPhoto = profileImg.src;

      const newPost = document.createElement('div');
      newPost.className = 'card post-card';
      // Atributos de busca dinâmicos para o novo post
      newPost.setAttribute('data-company', currentName);
      newPost.setAttribute('data-category', currentRole);

      newPost.innerHTML = `
        <div class="post-header">
          <img class="post-avatar-img" src="${currentPhoto}" alt="Avatar">
          <div>
            <strong class="company-name">${escapeHTML(currentName)}</strong>
            <p style="font-size: 0.8rem; color: #777;">Agora mesmo • ${escapeHTML(currentRole)}</p>
          </div>
        </div>
        <div class="post-content">${escapeHTML(text)}</div>
        <div class="post-actions">
          <button class="action-btn" onclick="toggleLike(this)">👍 Curtir (<span class="like-count">0</span>)</button>
          <button class="action-btn">💬 Comentar</button>
          <button class="action-btn">🔄 Compartilhar</button>
        </div>
      `;

      postsFeed.prepend(newPost);
      postInput.value = '';
    });

    // 6. Função de Curtir
    function toggleLike(button) {
      const countSpan = button.querySelector('.like-count');
      let currentLikes = parseInt(countSpan.textContent);

      if (button.classList.contains('liked')) {
        button.classList.remove('liked');
        countSpan.textContent = currentLikes - 1;
      } else {
        button.classList.add('liked');
        countSpan.textContent = currentLikes + 1;
      }
    }

    // 7. Botão de Conectar Empresas
    function toggleConnect(btn) {
      if (btn.textContent === 'Conectar') {
        btn.textContent = 'Pendente';
        btn.style.backgroundColor = '#eef3f8';
      } else {
        btn.textContent = 'Conectar';
        btn.style.backgroundColor = 'transparent';
      }
    }

    // Função para evitar injeção de scripts no feed
    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, 
        tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag)
      );
    }
