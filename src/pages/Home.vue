<template>
  <div id="home">    
    <div class="newpost">
      <h2>Bem vindo de volta!</h2>
      <span>Compartilhe seu dia</span>
      <hr>
      <textarea 
        placeholder="O que está fazendo hoje?"
        rows="15"
        v-model="input"
      >
      </textarea>
      <button class="button" @click="createPost">Compartilhar</button>
    </div>

    <div class="postarea loading" v-if="loading">
      <article>
        <h2>Buscando posts...</h2>
      </article>
    </div>
    <div class="postarea" v-else>
      <article class="post" v-for="post in posts" :key="post.id">
        <router-link class="cursor" tag="h1" :to="`/perfil/${post.userId}`">{{post.autor}}</router-link>
        <p>{{post.content | postLength }}</p>

        <div class="action-post">
          <a class="link" @click="likePost(post.id, post.likes)" href="#">{{post.likes === 0 ? 'Curtir' : post.likes + ' Curtidas'}}</a>
          <a class="link" @click="toggleModal(post)" href="#">Veja post completo</a>
        </div>

        <hr>
      </article>      
    </div>

    <Modal @close="toggleModal" v-if="showPostModal" :post="fullPost">
    
    </Modal>
  </div>
</template>
  
  <script>
    import firebase from '../services/firebaseConnection';
    import Modal from '../components/Modal';
 
  export default {
    name: 'HomeApp', 
    components:{
      Modal
    },
    data(){
      return{
        input: '',
        user: {},
        loading: true,
        posts: [],
        showPostModal: false,
        fullPost: {}
      }
    },

    async created(){
      const user = localStorage.getItem('devpost');
      this.user = JSON.parse(user);

      await firebase.firestore().collection('posts')
      .orderBy('created', 'desc')
      .onSnapshot((doc)=>{
        this.posts = [];

        doc.forEach((item)=>{
            this.posts.push({
              id: item.id,
              autor: item.data().autor,
              content: item.data().content,
              likes: item.data().likes,
              created: item.data().created,
              userId: item.data().userId
            });
        })

        this.loading = false;        
      })
    },

    methods: {
      async createPost(){
        if(this.input === ''){
          return;
        }

        await firebase.firestore().collection('posts')
        .add({
            created: new Date(),
            content: this.input,
            autor: this.user.nome,
            userId: this.user.uid,
            likes: 0,
        })
        .then(() => {
          this.input = '',
          console.log('POST CRIADO COM SUCESSO!');
        })
        .catch((error)=>{
          console.log('Error ao criar o post' + error)
        })
      },

      async likePost(id, likes){
        const userId = this.user.uid;
        const docId = `${userId}_${id}`;

        //Checando se o post já foi curtido
        const doc = await firebase.firestore().collection('likes')
        .doc(docId).get()

        if(doc.exists){
          await firebase.firestore().collection('posts')
          .doc(id).update({
            likes: likes - 1
          })

          await firebase.firestore().collection('likes')
          .doc(docId).delete();
          return;
        }

        await firebase.firestore().collection('likes')
        .doc(docId).set({
          postId: id,
          userId: userId
        });

        //Criar o like
        await firebase.firestore().collection('posts')
        .doc(id).update({
          likes: likes + 1
        });
      },

      toggleModal(post){
        this.showPostModal = !this.showPostModal;

        if(this.showPostModal){
          this.fullPost = post;
        }else{
          this.fullPost = {};
        }
      }
    },

    filters:{
      postLength(valor){        
        if(valor.length < 200){
          return valor;
        }

        return `${valor.substring(0, 200)}...`
      }
    }    
  }
  </script>
  
  <style scoped>
    .postarea{
      background: #757575;     
      padding: 10px 10px;
      color: white;
      flex-direction: column;
      margin-left: 10px;
      width: 400px;
    }

    .newpost{
      background: #757575;
      height: 370px;
      padding: 10px 10px;
      color: white;
      flex-direction: column;
    }

    #home{
      display: flex;
      flex-direction: row;
      margin: 25px;
    }

    textarea{
      width: 96%;
    }

    .button{
      color: white ;      
      width: 100%;
      height: 30px;
      background-color: #6c66be;
      margin-bottom: 10px;
    }

    .link{
      color: darkgoldenrod;
      padding: 10px 10px;
    }

    .cursor{
      cursor: pointer;
    }
  </style>
  