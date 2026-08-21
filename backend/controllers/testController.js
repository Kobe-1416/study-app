const supabase = require("../db/supabase");

const testDatabase = async (req, res) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .limit(1);

    if (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message
        });
    }

    res.json({
        message: "Supabase connection works",
        data
    });
};

module.exports = {
    testDatabase
};