<template>
    <div class="columns">
        <div class="column is-2 is-offset-10 cont">
            <table class="table">
                <thead>
                    <tr>
                        <th colspan="2" class="ttit">{{ title }}</th>  
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><img src="@/assets/icons/red-blank.png" alt="confirmado"></td>
                        <td class="texto">Confirmado</td>
                    </tr>
                    <tr>
                        <td><img src="@/assets/icons/orange-blank.png" alt="confirmado"></td>
                        <td class="texto">Em Investigação</td>
                    </tr>
                    <tr>
                        <td><img src="@/assets/icons/grn-blank.png" alt="confirmado"></td>
                        <td class="texto">Descartado</td>
                    </tr>
                </tbody>
                
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            teste: 'Caramba'
        }
    },
    props: {title: String}
}
</script>

<style scoped>
table{
    width: 100%;
}
.ttit{
    text-align: center !important;
}
img{
    height: 15px !important;
}
    .cont{
        margin-right: 2rem;
        margin-top: 1rem;
        border: #444 double;
        padding: 1rem; 
        
    }
    .cont table{
        
        background-color: transparent;
    }
    .texto{
        font-size: small !important;
    }
</style>