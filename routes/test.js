const express = require('express');

const { authenticateUser } = require('../service/init-module');
const { enrollTest, getTotalHashtag } = require('../service/manage-test');

const router = express.Router();

/**
 * @api {get} /test 1. Test test api (TEST)
 * @apiName test test call api
 * @apiGroup 2. Test
 *
 * @apiSuccess {String} message 'test'
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: "test"
 *  }
 */
router.get('/', authenticateUser, (req, res, next) => {
  res.send({
    message: 'test',
  });
});

/**
 * @api {post} /test/post-test 2. Post Test
 * @apiName post test
 * @apiGroup 2. Test
 *
 * @apiParam {JSON} test test 안에는 place(array type), concept(array type) 존재
 * @apiParamExample {JSON} Request-Example:
 * {
 *   "test": {
 *       "place": ["아무데나"],
 *       "concept": ["전체"]
 *   }
 * }
 *
 * @apiSuccess {String} message 'success'
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *    message: "success"
 *  }
 */
router.post('/post-test', authenticateUser, async (req, res, next) => {
  let enrollResult;
  try {
    const { test } = req.body;
    if (!test) {
      res.send({
        message: 'Input body - test',
      });
      return;
    }
    enrollResult = await enrollTest(req.user.id, test);
  } catch (err) {
    console.error('post-test error');
    console.error(err.message);
    throw err;
  }
  res.send({
    message: enrollResult,
  });
});

/**
 * @api {get} /test/get-test 3. Get Test
 * @apiName get test
 * @apiGroup 2. Test
 *
 * @apiSuccess {JSON} area area in test result with friend
 * @apiSuccess {JSON} category category in test result with friend
 * @apiSuccessExample {JSON} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "area": [
 *       {
 *           "id": 1,
 *           "area_code": 1,
 *           "area_name": "서울"
 *       },
 *       {
 *           "id": 27,
 *           "area_code": 2,
 *           "area_name": "인천"
 *       },
 *       {
 *           "id": 247,
 *           "area_code": 39,
 *           "area_name": "제주도"
 *       }
 *   ],
 *   "category": [
 *       {
 *           "id": 6,
 *           "category_code": "A01010400",
 *           "category_name": "산"
 *       },
 *       {
 *           "id": 11,
 *           "category_code": "A01010900",
 *           "category_name": "계곡"
 *       },
 *       {
 *           "id": 14,
 *           "category_code": "A01011200",
 *           "category_name": "해수욕장"
 *       }
 *   ],
 *   "message": "OK"
 *  }
 */
router.get('/get-test', authenticateUser, async (req, res, next) => {
  let testResult;
  try {
    testResult = await getTotalHashtag(req.user.id);
    if (!testResult) {
      res.send({
        message: 'Not Exist Test',
      });
      return;
    }
  } catch (err) {
    console.error('get-test error');
    console.error(err.message);
    throw err;
  }
  res.send(testResult);
});

module.exports = router;
