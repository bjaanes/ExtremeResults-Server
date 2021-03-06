var reflectionController = function (Reflection) {

    var post = function (req, res) {
        var reflection = new Reflection();

        reflection.typeName = req.body.typeName;
        reflection.firstThingThatWentWell = req.body.firstThingThatWentWell;
        reflection.secondThingThatWentWell = req.body.secondThingThatWentWell;
        reflection.thirdThingThatWentWell = req.body.thirdThingThatWentWell;
        reflection.firstThingToImprove = req.body.firstThingToImprove;
        reflection.secondThingToImprove = req.body.secondThingToImprove;
        reflection.thirdThingToImprove = req.body.thirdThingToImprove;
        reflection.effectiveDate = req.body.effectiveDate;
        reflection.user = req.user._id;

        var validation = reflection.validateSync();
        if (validation) {
            res.status(400).send(validation.toString());
        } else {
            reflection.save(function (error) {
                if (error) {
                    res.status(500).send(error);
                } else {
                    res.status(201).send(reflection);
                }
            });
        }
    };

    var get = function (req, res) {
        var query = {
            user: req.user._id
        };

        var mongooseQuery = Reflection.find(query);

        if (req.query.limit) {
            mongooseQuery.limit(parseInt(req.query.limit));
        }

        if (req.query.offset) {
            mongooseQuery.skip(parseInt(req.query.offset));
        }

        mongooseQuery.sort({effectiveDate: 'descending'});

        mongooseQuery.exec(function (error, reflections) {
            if (error) {
                res.status(500).send(error);
            } else {
                var entries = [];

                reflections.forEach(function (reflection) {
                    entries.push({
                        objectId: reflection._id,
                        typeName: reflection.typeName,
                        firstThingThatWentWell: reflection.firstThingThatWentWell,
                        secondThingThatWentWell: reflection.secondThingThatWentWell,
                        thirdThingThatWentWell: reflection.thirdThingThatWentWell,
                        firstThingToImprove: reflection.firstThingToImprove,
                        secondThingToImprove: reflection.secondThingToImprove,
                        thirdThingToImprove: reflection.thirdThingToImprove,
                        effectiveDate: reflection.effectiveDate,
                        className: 'Reflection'
                    });
                });

                res.json(entries);
            }
        });
    };

    var getReflectionId = function (req, res) {
        res.json(req.reflection);
    };

    var putReflectionId = function (req, res) {
        req.reflection.typeName = req.body.typeName;
        req.reflection.firstThingThatWentWell = req.body.firstThingThatWentWell;
        req.reflection.secondThingThatWentWell = req.body.secondThingThatWentWell;
        req.reflection.thirdThingThatWentWell = req.body.thirdThingThatWentWell;
        req.reflection.firstThingToImprove = req.body.firstThingToImprove;
        req.reflection.secondThingToImprove = req.body.secondThingToImprove;
        req.reflection.thirdThingToImprove = req.body.thirdThingToImprove;
        req.reflection.effectiveDate = req.body.effectiveDate;

        var validation = req.reflection.validateSync();
        if (validation) {
            res.status(400).send(validation.toString());
        } else {
            req.reflection.save(function (error) {
                if (error) {
                    res.status(500).send(error);
                } else {
                    res.json(req.reflection);
                }
            });
        }
    };

    var deleteReflectionId = function (req, res) {
        req.reflection.remove(function (error) {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(204).send();
            }
        });
    };

    return {
        post: post,
        get: get,
        reflectionId: {
            get: getReflectionId,
            put: putReflectionId,
            delete: deleteReflectionId
        }
    }

};

module.exports = reflectionController;