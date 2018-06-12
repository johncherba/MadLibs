'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function () {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function () {
        let speech = ('Let\'s play mad libs! What\'s your name?');
        let reprompt = ('Tell me your name.');
        this.followUpState('MyName')
            .ask(speech, reprompt);
    },

    'MyName': {
        'MyNameIsIntent': function (name) {
            this.setSessionAttribute('name', name.value);
            let speech = ('Hey ' + name.value + ', nice to meet you! Would you like to play a game?');
            let reprompt = ('Please say yes or no.');
            this.followUpState('PlayGame')
                .ask(speech, reprompt);
        }
    },

    'PlayGame' : {
        'YesIntent': function () {
            this.toGlobalIntent('FirstQuestionIntent');
        },
        'NoIntent': function () {
            this.toGlobalIntent('LAUNCH');
        }
    },

    'FirstQuestionIntent': function () {
        // this.tell('im here');
        let speech = ('Please say a part of the body.');
        let reprompt = ('Give me a body part.');
        this.followUpState('FirstAnswer')
            .ask(speech, reprompt);
    },

    'FirstAnswer': {
        'FirstAnswerIntent': function (partOfBody) {
            this.setSessionAttribute('partOfBody', partOfBody.value);
            let speech = ('Thanks, ' + this.getSessionAttribute('name') + '. You said ' + partOfBody.value +'. Next question. Please say a type of fluid. ');
            let reprompt = ('Please say a type of fluid.');
            this.followUpState('SecondAnswer')
                .ask(speech, reprompt);
        }
    },

    'SecondAnswer': {
        'SecondAnswerIntent': function (typeOfFluid) {
            this.setSessionAttribute('typeOfFluid', typeOfFluid.value);
            let speech = ('Thanks, ' + this.getSessionAttribute('name') + '. You said ' + typeOfFluid.value +'. Next question. Please say a substance. ');
            let reprompt = ('Please say a substance.');
            this.followUpState('ThirdAnswer')
                .ask(speech, reprompt);
        }
    },

    'ThirdAnswer': {
        'ThirdAnswerIntent': function (aSubstance) {
            this.setSessionAttribute('aSubstance', aSubstance.value);
            let speech = ('Thanks, ' + this.getSessionAttribute('name') + '. You said ' + aSubstance.value +
                '. Okay. Here is the Mad Libs story titled Excused. ' + this.getSessionAttribute('name') + ' is sick with the ' + this.getSessionAttribute('partOfBody') +
                ' flu. Drink more ' + this.getSessionAttribute('typeOfFluid') + ' and take ' + this.getSessionAttribute('aSubstance') + ' as needed. Would you like to play again?');
            let reprompt = ('Please say a substance.');
            this.followUpState('PlayGame')
                .ask(speech, reprompt);
        }
    }

});

module.exports.app = app;
