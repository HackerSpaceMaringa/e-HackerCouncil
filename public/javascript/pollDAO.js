/*
 * PollDAO is responsable to manage polls in the database.
 */

var pollDAO = function {
  /* Insert a poll in DB. Expecting a to be a poll object.
   * PollObj:
   *  a.title
   *  a.description
   *  a.date
   *  a.owner   <-- Is a user name
   *  */
  function insert(a)  {
    //TODO
  }

  /* Remove a poll with the same ID; */
  function remove(id) {
    //TODO
  }

  /* List the last n polls createds.
   * n = number of polls to list. */
  function list(n) {
    //TODO
  }
}
