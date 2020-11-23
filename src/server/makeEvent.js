const {isStringValidLength, isEnumValid, isTimeStampValid} = require("./util");
const {db} = require("../server");

exports.makeEvent = (req, res) => {
    let { token, title, location, description, start, end, recurring, recurringuntil, category } = req.body;

    if(!isStringValidLength(token, 60, 60)
            || !isStringValidLength(title, 1, 255)
            || !isStringValidLength(location, 0, 500)
            || !isStringValidLength(description, 0, 65535)
            || !isStringValidLength(start, 19, 19)
            || !isStringValidLength(end, 19, 19)
            || !isStringValidLength(recurring, 0, 7)
            || !isStringValidLength(recurringuntil, 0, 19)){
        res.status(400);
        res.json({
            message: "Invalid length of parameter.",
            huh: req.body,
            token: token,
            title: title,
            start: start,
            end: end
        });

        return;
    }

    if(!isEnumValid(recurring, ['not', 'weekly', 'monthly', 'yearly'], true)){
        res.status(400);
        res.json({
            message: "Invalid enum."
        });

        return;
    }

    if(!isTimeStampValid(start, false)
            || !isTimeStampValid(end, false)
            || !isTimeStampValid(recurringuntil, true)){
        res.status(400);
        res.json({
            message: "Invalid time stamp."
        });

        return;
    }

    if(category !== undefined && category !== null && isNaN(Number(category)) || Number(category) < 0 || Number(category) > 9){
        res.status(400);
        res.json({
            message: "Category is NaN or out of range."
        });

        return;
    }

    // TODO: there are many checks we could/should do with the time stamps

    db.query(`SELECT username
            FROM tokens
            WHERE token = ?`, [token], (error, results, fields) => {
        if(error) throw error;

        if(results.length === 0){
            res.status(400);
            res.json({
                message: "Token not found."
            });

            return;
        }

        let username = results[0].username;

        db.query(`INSERT INTO events(
                   username,
                   title,
                   location,
                   description,
                   start,
                   end,
                   recurring,
                   recurringuntil,
                   category)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,

                [username,
                title,
                location || null,
                description || null,
                start,
                end,
                recurring || 'not',
                recurringuntil || null,
                category || 0],
                (error, results, fields) => {

            if(error) throw error;

            db.query(`SELECT MAX(id) AS id
                    FROM events
                    WHERE username = ?`, [username], (error, results, fields) => {
                if(error) throw error;

                res.json({
                    message: "Event made.",
                    id: results[0].id
                });
            });
        });
    });
};
