describe("Related For Outcomes Controller", function() {
    var relatedForOutcomesController,
        responseMock,
        requestMock,
        OutcomeMock,
        momentMock,
        momentReturnMock,
        ReflectionMock;

    beforeEach(function() {
        OutcomeMock = function () {};
        OutcomeMock.prototype.save = function () {};
        OutcomeMock.prototype.remove = function () {};
        OutcomeMock.prototype.validateSync = function () {};
        OutcomeMock.find = function () {};

        ReflectionMock = function () {};
        ReflectionMock.prototype.save = function () {};
        ReflectionMock.prototype.remove = function () {};
        ReflectionMock.prototype.validateSync = function () {};
        ReflectionMock.find = function () {};

        momentReturnMock = {
            startOf: function () { return momentReturnMock },
            endOf: function () { return momentReturnMock },
            toDate: function () { return momentReturnMock },
            subtract: function () { return momentReturnMock }
        };

        momentMock = function () {
            return momentReturnMock;
        };

        requestMock = {
            user: {},
            query: {}
        };

        responseMock = {
            status: function () {
                return responseMock;
            },
            send: function () {},
            json: function () {}
        };

        relatedForOutcomesController = require('../../../controllers/relatedForOutcomesController')(OutcomeMock, ReflectionMock, momentMock);
    });

    describe('/related/outcomes', function () {
        describe('get', function () {
            it('should work for Daily', function () {
                spyOn(responseMock, 'json').and.callThrough();
                var results = [
                    {
                        typeName: 'Weekly',
                        firstStory: 'The First Weekly Story',
                        secondStory: 'The Second Weekly Story',
                        thirdStory: 'The Third Weekly Story',
                        effectiveDate: new Date()
                    }
                ];

                spyOn(OutcomeMock, 'find').and.callFake(function (query, callback) {
                     callback(undefined, results);
                });

                requestMock.query.typeName = 'Daily';

                relatedForOutcomesController.get(requestMock, responseMock);

                var firstRelated = responseMock.json.calls.mostRecent().args[0][0];
                expect(firstRelated.objectId).toEqual(results[0]._id);
                expect(firstRelated.typeName).toEqual(results[0].typeName);
                expect(firstRelated.firstStory).toEqual(results[0].firstStory);
                expect(firstRelated.secondStory).toEqual(results[0].secondStory);
                expect(firstRelated.thirdStory).toEqual(results[0].thirdStory);
                expect(firstRelated.effectiveDate).toEqual(results[0].effectiveDate);
                expect(firstRelated.className).toEqual('Outcome');

            });

            it('should work for Monthly', function () {
                spyOn(responseMock, 'json').and.callThrough();
                var resultsForReflections = [{
                    typeName: 'Monthly',
                    firstThingThatWentWell: 'The First Thing That Went Well',
                    secondThingThatWentWell: 'The Second Thing That Went Well',
                    thirdThingThatWentWell: 'The Third Thing That Went Well',
                    firstThingToImprove: 'The First Thing To Improve',
                    secondThingToImprove: 'The Second Thing To Improve',
                    thirdThingToImprove: 'The Third Thing To Improve',
                    effectiveDate: new Date()
                }];
                var resultsForOutcomes = [{
                    typeName: 'Monthly',
                    firstStory: 'The First Weekly Story',
                    secondStory: 'The Second Weekly Story',
                    thirdStory: 'The Third Weekly Story',
                    effectiveDate: new Date()
                }];
                spyOn(ReflectionMock, 'find').and.callFake(function (query, callback) {
                    callback(undefined, resultsForReflections);
                });
                spyOn(OutcomeMock, 'find').and.callFake(function (query, callback) {
                    callback(undefined, resultsForOutcomes);
                });


                requestMock.query.typeName = 'Monthly';

                relatedForOutcomesController.get(requestMock, responseMock);

                var firstRelated = responseMock.json.calls.mostRecent().args[0][0];
                expect(firstRelated.objectId).toEqual(resultsForOutcomes[0]._id);
                expect(firstRelated.typeName).toEqual(resultsForOutcomes[0].typeName);
                expect(firstRelated.firstStory).toEqual(resultsForOutcomes[0].firstStory);
                expect(firstRelated.secondStory).toEqual(resultsForOutcomes[0].secondStory);
                expect(firstRelated.thirdStory).toEqual(resultsForOutcomes[0].thirdStory);
                expect(firstRelated.effectiveDate).toEqual(resultsForOutcomes[0].effectiveDate);
                expect(firstRelated.className).toEqual('Outcome');

                var secondRelated = responseMock.json.calls.mostRecent().args[0][1];
                expect(secondRelated.objectId).toEqual(resultsForReflections[0]._id);
                expect(secondRelated.typeName).toEqual(resultsForReflections[0].typeName);
                expect(secondRelated.firstThingThatWentWell).toEqual(resultsForReflections[0].firstThingThatWentWell);
                expect(secondRelated.secondThingThatWentWell).toEqual(resultsForReflections[0].secondThingThatWentWell);
                expect(secondRelated.thirdThingThatWentWell).toEqual(resultsForReflections[0].thirdThingThatWentWell);
                expect(secondRelated.firstThingToImprove).toEqual(resultsForReflections[0].firstThingToImprove);
                expect(secondRelated.secondThingToImprove).toEqual(resultsForReflections[0].secondThingToImprove);
                expect(secondRelated.thirdThingToImprove).toEqual(resultsForReflections[0].thirdThingToImprove);
                expect(secondRelated.effectiveDate).toEqual(resultsForReflections[0].effectiveDate);
                expect(secondRelated.className).toEqual('Reflection');
            });

            it('should work for Weekly', function () {
                spyOn(responseMock, 'json').and.callThrough();
                var resultsForReflections = [{
                    typeName: 'Weekly',
                    firstThingThatWentWell: 'The First Thing That Went Well',
                    secondThingThatWentWell: 'The Second Thing That Went Well',
                    thirdThingThatWentWell: 'The Third Thing That Went Well',
                    firstThingToImprove: 'The First Thing To Improve',
                    secondThingToImprove: 'The Second Thing To Improve',
                    thirdThingToImprove: 'The Third Thing To Improve',
                    effectiveDate: new Date()
                }];
                var resultsForOutcomes = [{
                    typeName: 'Weekly',
                    firstStory: 'The First Weekly Story',
                    secondStory: 'The Second Weekly Story',
                    thirdStory: 'The Third Weekly Story',
                    effectiveDate: new Date()
                }];
                spyOn(ReflectionMock, 'find').and.callFake(function (query, callback) {
                    callback(undefined, resultsForReflections);
                });
                spyOn(OutcomeMock, 'find').and.callFake(function (query, callback) {
                    callback(undefined, resultsForOutcomes);
                });


                requestMock.query.typeName = 'Weekly';

                relatedForOutcomesController.get(requestMock, responseMock);

                var firstRelated = responseMock.json.calls.mostRecent().args[0][0];
                expect(firstRelated.objectId).toEqual(resultsForOutcomes[0]._id);
                expect(firstRelated.typeName).toEqual(resultsForOutcomes[0].typeName);
                expect(firstRelated.firstStory).toEqual(resultsForOutcomes[0].firstStory);
                expect(firstRelated.secondStory).toEqual(resultsForOutcomes[0].secondStory);
                expect(firstRelated.thirdStory).toEqual(resultsForOutcomes[0].thirdStory);
                expect(firstRelated.effectiveDate).toEqual(resultsForOutcomes[0].effectiveDate);
                expect(firstRelated.className).toEqual('Outcome');

                var secondRelated = responseMock.json.calls.mostRecent().args[0][1];
                expect(secondRelated.objectId).toEqual(resultsForReflections[0]._id);
                expect(secondRelated.typeName).toEqual(resultsForReflections[0].typeName);
                expect(secondRelated.firstThingThatWentWell).toEqual(resultsForReflections[0].firstThingThatWentWell);
                expect(secondRelated.secondThingThatWentWell).toEqual(resultsForReflections[0].secondThingThatWentWell);
                expect(secondRelated.thirdThingThatWentWell).toEqual(resultsForReflections[0].thirdThingThatWentWell);
                expect(secondRelated.firstThingToImprove).toEqual(resultsForReflections[0].firstThingToImprove);
                expect(secondRelated.secondThingToImprove).toEqual(resultsForReflections[0].secondThingToImprove);
                expect(secondRelated.thirdThingToImprove).toEqual(resultsForReflections[0].thirdThingToImprove);
                expect(secondRelated.effectiveDate).toEqual(resultsForReflections[0].effectiveDate);
                expect(secondRelated.className).toEqual('Reflection');
            });


            it('should send 400 if typeName is not supported', function () {
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();

                requestMock.query.typeName = 'Not Supported';

                relatedForOutcomesController.get(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(400);
                expect(responseMock.send).toHaveBeenCalled();
            });

            it('should send back 500 if Outcome search goes wrong with Daily', function () {
                var error = 'This is an error';
                spyOn(OutcomeMock, 'find').and.callFake(function (query, callback) {
                    callback(error, undefined);
                });
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();

                requestMock.query.typeName = 'Daily';

                relatedForOutcomesController.get(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(error);
            });

            it('should send back 500 if Outcome search goes wrong with Weekly', function () {
                var error = 'This is an error';
                var resultsForOutcomes = [{testses: 'test1232'}];
                spyOn(ReflectionMock, 'find').and.callFake(function (query, callback) {
                    callback(error, resultsForOutcomes);
                });
                spyOn(OutcomeMock, 'find').and.callFake(function (query, callback) {
                    callback(error, undefined);
                });
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();

                requestMock.query.typeName = 'Weekly';

                relatedForOutcomesController.get(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(error);
            });

            it('should send back 500 if Reflection search goes wrong with Weekly', function () {
                var error = 'This is an error';
                spyOn(ReflectionMock, 'find').and.callFake(function (query, callback) {
                    callback(error, undefined);
                });
                spyOn(responseMock, 'status').and.callThrough();
                spyOn(responseMock, 'send').and.callThrough();

                requestMock.query.typeName = 'Weekly';

                relatedForOutcomesController.get(requestMock, responseMock);

                expect(responseMock.status).toHaveBeenCalledWith(500);
                expect(responseMock.send).toHaveBeenCalledWith(error);
            });
        });
    });
});
