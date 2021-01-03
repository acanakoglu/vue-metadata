export const FULL_TEXT = 'FULL NUCLEOTIDE SEQUENCE'
export const LOADING_TEXT = 'Loading...'

export const poll = (id, callback) => {
    let myInterval;
    myInterval = setInterval(() => {
        $.get(`api/poll/${id}`, (data) => {
            if (data.ready) {
                clearInterval(myInterval);
                callback(data.result);
            }
        }).fail(function () {
            clearInterval(myInterval);
        });
    }, 5000);
}