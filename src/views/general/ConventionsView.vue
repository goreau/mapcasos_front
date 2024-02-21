<template>
    <div class="columns is-centered">
        <div class="column is-three-fifths">
            <Loader v-if="isLoading" />
            <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title is-centered">Esquema de cores dos marcadores</p>
                </header>
                <div class="card-content">
                    <div class="content">
                        <div style="padding: 10px 30px 50px 80px">
                            <table>
                                <tr>
                                    <td colspan="6" align="center">
                                        <h3>Resultado:</h3>
                                    </td>
                                </tr>
                                <tr>
                                    <td><img src="@/assets/icons/red-blank.png" alt="confirmado"></td>
                                    <td valign="center">- Caso confirmado</td>
                                    <td><img src="@/assets/icons/orange-blank.png" alt="aberto"></td>
                                    <td valign="center"> - Caso inconclusivo</td>
                                    <td><img src="@/assets/icons/grn-blank.png" alt="descartado"></td>
                                    <td valign="center"> - Caso descartado</td>
                                </tr>
                            </table>
                            <table>
                                <tr>
                                    <td colspan="6" align="center">
                                        <h3>Agravos:</h3>
                                    </td>
                                </tr>
                                <tr>
                                    <td><img src="@/assets/icons/red_MarkerD.png" alt="dengue"></td>
                                    <td valign="center"> - <b>D</b>engue</td>
                                    <td><img src="@/assets/icons/red_MarkerZ.png" alt="zika"></td>
                                    <td valign="center"> - <b>Z</b>ika</td>
                                    <td><img src="@/assets/icons/red_MarkerK.png" alt="chick"></td>
                                    <td valign="center"> - Chi<b>k</b>ungunya</td>
                                </tr>
                                <tr>
                                    <td><img src="@/assets/icons/red_MarkerC.png" alt="chagas"></td>
                                    <td valign="center"> - Doença de <b>C</b>hagas</td>
                                    <td><img src="@/assets/icons/red_MarkerV.png" alt="visceral"></td>
                                    <td valign="center"> - Leishmaniose <b>V</b>isceral Americana</td>
                                    <td><img src="@/assets/icons/red_MarkerT.png" alt="tegumentar"></td>
                                    <td valign="center"> - Leishmaniose <b>T</b>egumentar Americana<br></td>
                                </tr>

                                <tr>
                                    <td><img src="@/assets/icons/red_MarkerE.png" alt="esquisto"></td>
                                    <td valign="center"> - <b>E</b>squistossomose</td>
                                    <td><img src="@/assets/icons/red_MarkerB.png" alt="maculosa"></td>
                                    <td valign="center"> - Febre Maculosa <b>B</b>rasileira</td>
                                    <td><img src="@/assets/icons/red_MarkerA.png" alt="amarela"></td>
                                    <td valign="center"> - Febre <b>A</b>marela</td>
                                </tr>
                                <tr>
                                    <td><img src="@/assets/icons/red_MarkerM.png" alt="malaria"></td>
                                    <td valign="center"> - <b>M</b>alária</td>
                                    <td><img src="@/assets/icons/red_MarkerX.png" alt="escorpião"></td>
                                    <td valign="center"> - Escorpião</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style></style>