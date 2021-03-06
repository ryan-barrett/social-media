const Model = require('./model');

class CommentModel extends Model {

  id;
  body;
  userId;
  postId;

  /**
   * @param {string} body
   * @param {string} userId
   * @param {string} postId
   *
   */
  constructor(body, userId, postId) {
    super('comment');
    this.id = this.generateId();
    this.body = body;
    this.userId = userId;
    this.postId = postId;
  }

  /**
   * @param {string} id
   */
  static async Get(id) {
    try {
      const rows = await this.postgres.query(
        'SELECT id, body, user_id, post_id FROM comments WHERE id = $1;',
        [id]
      );
      return rows[0];
    }
    catch (error) {
      this.logger.error({ id, error }, 'error getting comment');
      return {};
    }
  }

  /**
   *
   * @param comment
   *
   */
  static async Insert(comment) {
    try {
      const { id, body, userId, postId } = comment;

      await this.postgres.query(
        'INSERT INTO comments (id, body, user_id, post_id)'
        + 'VALUES ($1, $2, $3, $4);',
        [id, body, userId, postId]
      );
      return { id };
    }
    catch (error) {
      this.logger.error({ comment, error }, 'error creating comment');
      return {};
    }
  }

  /**
   *
   * @param {string} id
   * @param {object} update
   */
  static async update(id, update) {
    try {
      const { body, userId, postId } = update;
      this.logger.error(this.update);
      await this.postgres.query(
        'UPDATE comments SET id = $1, body = $2, user_id = $3, post_id = $4 WHERE id = $1;',
        [id, body, userId, postId]
      );

      return { id };
    }
    catch (error) {
      this.logger.error({ id, update, error }, 'error updating comment');
      return {};
    }
  }

  /**
   *
   * @param {string} id
   *
   */
  static async Delete(id) {
    this.logger.info(id);
    try {
      await this.postgres.query('DELETE FROM comments WHERE id = $1 RETURNING *;', [id]);
      return true;
    }
    catch (error) {
      this.logger.error({ id, error }, 'error deleting comments');
      return false;
    }
  }

  /**
   * @param {string} id
   */
  static async GetUserId(id) {
    try {
      const rows = await this.postgres.query(
        'SELECT user_id AS "userId"' +
        'FROM posts ' +
        'WHERE id = $1;',
        [id]
      );
      return rows[0];
    }
    catch (error) {
      this.logger.error({ id, error }, 'error getting UserId');
      return {};
    }
  }
}

module.exports = CommentModel;
