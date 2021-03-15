// eslint-disable-next-line @typescript-eslint/no-var-requires
const { setup } = require("./src/jest-global-setup-teardown");

// Если у Вас возник вопрос wtf происходит в этом файле:
// Чтобы писать сетап на ts-e и, соответственно, иметь возможность подключать другие ts-модули
// нужен такой костыль
// https://github.com/kulshekhar/ts-jest/issues/411#issuecomment-605515177
module.exports = async () => {
  await setup();
};
