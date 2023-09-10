<template lang="html" src="./movement.html" />

<script>


export default {
    name: 'MovementComponent',
    props: {                    //Exportando o Props
        container: [],
    },
    data() {                    //Definindo Variáveis
        return {
            movements: [],
            tipoMov: null,
            dia: null,
            hInicio: null,
            movId: null,
            hFim: null,
            errorMsgModal: null,
            selectedMov: null,
            movementId: null,
        };
    },
    created: function () {          //Cicloe de vida OnCreate 
        this.getMovements();
    },
    methods: {
        getMovements() {
            this.axios
                .get('http://localhost:8080/movement')
                .then(async (response) => {
                    if (response.status === 200) {
                        this.movements = await response.data;
                    } else {
                        throw console.log("Não foi possível Linha 16");
                    }
                })
        },
        hideModalCadMov() {
            this.$refs['modalCadMov'].hide();
            this.clearMovForm();
        },
        validaTime() {                      //Validador de tempo
            this.errorMsgModal = null;
            
            if (this.hInicio > this.hFim) {
                throw this.errorMsgModal = "Horarios Incompatíveis";
            }
            if (this.tipoMov === null){
                throw this.errorMsgModal = "Selecione uma Movimentação";
            }
            if(this.hInicio === null || this.hFim === null | this.dia === null){
                throw this.errorMsgModal = "Selecione a data corretamente";
            }
            this.errorMsgModal = "";
            return true;

        },
        cadMovement() {                         //Cadastrador Movement
            if (this.validaTime()) {
                const container = this.container;
                console.log(this.dia + " " + this.hFim);
                console.log(this.container.idContainer)
                const data = {
                    idContainerMovement: container.idContainer,
                    tipoMov: this.tipoMov,
                    horaInicio: this.dia + " " + this.hInicio,
                    horaFim: this.dia + " " + this.hFim
                }
                this.axios
                    .post('http://localhost:8080/movement', data)
                    .then(async (response) => {
                        if (response.status === 200) {
                            await this.getMovements();
                        }
                    }).finally(() => {
                        this.hideModalCadMov();
                        this.clearMovForm();
                    })
            }
        },
        clearMovForm() {
            this.tipoMov = null;
            this.dia = null;
            this.hInicio = null;
            this.hfim = null;
            this.errorMsgModal = "";
        },
        deleteMovement(id){
            this.axios
                .delete('http://localhost:8080/movement/' + id)
                .then(async (response) =>{
                    if (response.status === 200) {
                        await this.getMovements();
                    }
                })

        },
        openContentMov(movement){
            this.movId = movement.idContainerMovement;
            this.tipoMov = movement.tipoMov;
            this.dia = movement.dia;
            this.hInicio = movement.hInicio;
            this.hFim = movement.hFim;
            this.selectedMov = movement;
            this.movementId = movement.idMovement;
            this.$bvModal.show('modal-4');
        },
        alterMov(){
            if(this.validaTime()){
                const data = {
                    idMovement: this.movementId,
                    idContainerMovement: this.movId,
                    tipoMov: this.tipoMov,
                    horaInicio: this.dia + " " + this.hInicio,
                    horaFim: this.dia + " " + this.hFim
                }
                this.axios
                    .put('http://localhost:8080/movement', data)
                    .then(async (response) => {
                        if (response.status === 200) {
                            await this.getMovements();
                        }
                    }).finally(() => {
                        this.$refs['modalAlterMov'].hide();
                        this.clearMovForm();
                    })
            }
        }
    }

}

</script>

<style lang="scss" src="./style.scss"></style>
