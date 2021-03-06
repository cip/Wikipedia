/*
 *  Copyright 2011 Wolfgang Koller - http://www.gofg.at/
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


#include <QApplication>

#include "src/cordova.h"

#if QT_VERSION < 0x050000
#include "qmlapplicationviewer.h"
#else
# include <QDeviceInfo>
# include <QQuickView>
#endif

#include <QDeclarativeContext>
#include <QDeclarativeEngine>
#include <qplatformdefs.h>

#ifdef MEEGO_EDITION_HARMATTAN
# include <MDeclarativeCache>
#endif

#ifdef MEEGO_EDITION_HARMATTAN
Q_DECL_EXPORT int main(int argc, char *argv[])
#else
int main(int argc, char *argv[])
#endif
{

    QScopedPointer<QApplication> app(createApplication(argc, argv));

#if QT_VERSION < 0x050000
    QmlApplicationViewer viewer;
    Cordova::instance()->setTopLevelEventsReceiver(&viewer);
    viewer.rootContext()->setContextProperty("cordova", Cordova::instance());
    viewer.setMainQmlFile(QLatin1String("qml/cordova/main.qml"));
    viewer.showExpanded();
#else // QT_VERSION >= 0x050000

    //HACK: we don't have any solution to check for harmattan in qt5
    // so we use check for LINUX OS and for "dfl61" substring in kernel version
    // (at least pr1.1 and pr1.2 contains it)
    QDeviceInfo info;
    bool isHarmattan = info.version(QDeviceInfo::Firmware).contains("dfl61");
#ifndef Q_OS_LINUX
    isHarmattan = false;
#endif

    //TODO: look later at boostable possibility for this here
    QScopedPointer<QQuickView> view(new QQuickView());;

    Cordova::instance()->setTopLevelEventsReceiver(view.data());
    view->setResizeMode(QQuickView::SizeRootObjectToView);
    view->rootContext()->setContextProperty("cordova", Cordova::instance());

    if (isHarmattan) {
        view->setSource(QUrl(QString("%1/qml/main_harmattan_qt5.qml").arg(Cordova::instance()->workingDir())));
        view->showFullScreen();
    } else {
        view->setSource(QUrl(QString("%1/qml/main_qt5.qml").arg(Cordova::instance()->workingDir())));
        view->show();
    }
#endif

    return app->exec();
}
